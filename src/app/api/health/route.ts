import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * ใช้ตรวจว่า deploy ขึ้นแล้วและ DB เชื่อมได้หรือไม่
 * GET /api/health → { ok: true, db: 'ok' | 'error' }
 */
export async function GET() {
  let db: 'ok' | 'error' = 'error'
  try {
    await prisma.$queryRaw`SELECT 1`
    db = 'ok'
  } catch {
    // DATABASE_URL ไม่ถูกต้อง หรือยังไม่ได้รัน prisma db push
  }
  return NextResponse.json({ ok: true, db })
}
