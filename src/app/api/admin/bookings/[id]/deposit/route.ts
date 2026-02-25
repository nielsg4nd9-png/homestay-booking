import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  depositPaid: z.boolean(),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const role = (session?.user as { role?: string } | undefined)?.role ?? 'USER'
    if (role !== 'ADMIN' && role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ใช้งาน' }, { status: 403 })
    }

    const raw = await request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({ where: { id: params.id } })
    if (!booking) {
      return NextResponse.json({ error: 'ไม่พบรายการจอง' }, { status: 404 })
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: {
        depositPaid: parsed.data.depositPaid,
        depositPaidAt: parsed.data.depositPaid ? new Date() : null,
        depositVerificationStatus: parsed.data.depositPaid ? 'APPROVED' : 'NONE',
        depositReviewedAt: parsed.data.depositPaid ? new Date() : null,
        depositReviewNote: null,
      },
      select: {
        id: true,
        depositPaid: true,
        depositPaidAt: true,
      },
    })

    return NextResponse.json({ booking: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 })
  }
}

