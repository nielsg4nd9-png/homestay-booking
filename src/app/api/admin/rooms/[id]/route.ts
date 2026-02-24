import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9\-]+$/).optional(),
  description: z.string().optional(),
  pricePerNight: z.number().int().min(0).optional(),
  maxGuests: z.number().int().min(1).optional(),
  imageUrl: z.string().optional().nullable(),
  amenities: z.string().optional().nullable(),
})

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const room = await prisma.room.findUnique({ where: { id: params.id } })
    if (!room) {
      return NextResponse.json({ error: 'ไม่พบห้อง' }, { status: 404 })
    }
    const raw = await _request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง (slug ใช้เฉพาะ a-z, 0-9, -)' },
        { status: 400 }
      )
    }
    const data = parsed.data
    if (data.slug && data.slug !== room.slug) {
      const existing = await prisma.room.findUnique({ where: { slug: data.slug } })
      if (existing) {
        return NextResponse.json(
          { error: 'มีห้องใช้ slug นี้แล้ว' },
          { status: 409 }
        )
      }
    }
    const updated = await prisma.room.update({
      where: { id: params.id },
      data: data as Record<string, unknown>,
    })
    return NextResponse.json({ room: updated })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.room.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'ไม่สามารถลบได้' },
      { status: 500 }
    )
  }
}
