import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9\-]+$/).optional(),
  type: z.enum(['SERVICE', 'PRODUCT']).optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  price: z.number().int().min(0).optional().nullable(),
  unit: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
})

async function ensureStaff() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role ?? 'USER'
  return role === 'ADMIN' || role === 'EMPLOYEE'
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const allowed = await ensureStaff()
    if (!allowed) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ใช้งาน' }, { status: 403 })
    }

    const item = await prisma.serviceItem.findUnique({ where: { id: params.id } })
    if (!item) {
      return NextResponse.json({ error: 'ไม่พบรายการ' }, { status: 404 })
    }

    const raw = await request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง (slug ใช้เฉพาะ a-z, 0-9, -)' },
        { status: 400 }
      )
    }

    const data = parsed.data
    if (data.slug && data.slug !== item.slug) {
      const existing = await prisma.serviceItem.findUnique({ where: { slug: data.slug } })
      if (existing) {
        return NextResponse.json({ error: 'มีรายการใช้ slug นี้แล้ว' }, { status: 409 })
      }
    }

    const updated = await prisma.serviceItem.update({
      where: { id: params.id },
      data: data as Record<string, unknown>,
    })
    return NextResponse.json({ item: updated })
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

    await prisma.serviceItem.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'ไม่สามารถลบได้' }, { status: 500 })
  }
}

