import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9\-]+$/),
  description: z.string().optional(),
  pricePerNight: z.number().int().min(0),
  maxGuests: z.number().int().min(1),
  imageUrl: z.string().optional(),
  amenities: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const raw = await request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบหรือรูปแบบไม่ถูกต้อง (slug ใช้เฉพาะ a-z, 0-9, -)' },
        { status: 400 }
      )
    }
    const { slug, ...data } = parsed.data
    const existing = await prisma.room.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'มีห้องใช้ slug นี้แล้ว' },
        { status: 409 }
      )
    }
    const room = await prisma.room.create({
      data: { slug, ...data },
    })
    return NextResponse.json({ room })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    )
  }
}
