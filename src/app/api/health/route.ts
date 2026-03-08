import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * ใช้ตรวจว่า deploy ขึ้นแล้วและ DB เชื่อมได้หรือไม่
 * GET /api/health → { ok: true, db: 'ok' | 'error', hint?: string }
 */
export async function GET() {
  let db: 'ok' | 'error' = 'error'
  let hint: string | undefined
  try {
    await prisma.$queryRaw`SELECT 1`
    db = 'ok'
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const code = e && typeof e === 'object' && 'code' in e ? (e as { code?: string }).code : ''
    if (code === 'P1001' || /Can't reach database server/i.test(msg)) {
      hint = 'เชื่อมต่อ DB ไม่ได้: ตรวจสอบ DATABASE_URL ว่าถูกต้อง และถ้าใช้ Neon ต้องมี ?sslmode=require&connect_timeout=15 และใช้ host แบบ -pooler'
    } else if (/Environment variable not found: DATABASE_URL/i.test(msg)) {
      hint = 'ยังไม่ได้ตั้งค่า DATABASE_URL ใน Environment Variables ของ Vercel'
    } else if (/relation .* does not exist|does not exist/i.test(msg)) {
      hint = 'ยังไม่มีตารางใน DB: รัน npx prisma db push (โดยใช้ DATABASE_URL ตัวเดียวกับบน Vercel)'
    } else {
      hint = 'ตรวจสอบ DATABASE_URL และการรัน prisma db push ดู docs/DEPLOY-VERCEL.md'
    }
  }
  return NextResponse.json({ ok: true, db, ...(hint && { hint }) })
}
