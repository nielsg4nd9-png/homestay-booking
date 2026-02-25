import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9\-]+$/),
  type: z.enum(['SERVICE', 'PRODUCT']).default('SERVICE'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.number().int().min(0).optional(),
  unit: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const role = (session?.user as { role?: string })?.role ?? 'USER'
    if (role !== 'ADMIN' && role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ใช้งาน' }, { status: 403 })
    }

    const raw = await request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบหรือรูปแบบไม่ถูกต้อง (slug ใช้เฉพาะ a-z, 0-9, -)' },
        { status: 400 }
      )
    }

    const { slug, ...data } = parsed.data
    const existing = await prisma.serviceItem.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'มีรายการใช้ slug นี้แล้ว' }, { status: 409 })
    }

    const item = await prisma.serviceItem.create({
      data: { slug, ...data },
    })
    return NextResponse.json({ item })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 })
  }
}

