import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
})

async function ensureStaff() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role ?? 'USER'
  return role === 'ADMIN' || role === 'EMPLOYEE'
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const allowed = await ensureStaff()
    if (!allowed) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ใช้งาน' }, { status: 403 })
    }

    const raw = await request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 })
    }

    const updated = await prisma.heroSlide.update({
      where: { id: params.id },
      data: {
        title: parsed.data.title?.trim() || null,
        subtitle: parsed.data.subtitle?.trim() || null,
        imageUrl: parsed.data.imageUrl?.trim(),
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder,
      },
    })

    return NextResponse.json({ slide: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const allowed = await ensureStaff()
    if (!allowed) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ใช้งาน' }, { status: 403 })
    }

    await prisma.heroSlide.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'ไม่สามารถลบได้' }, { status: 500 })
  }
}

