import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  note: z.string().optional(),
})

type RouteParams = { params: { id: string } }

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    const role = (session?.user as { role?: string } | undefined)?.role ?? 'USER'
    if (role !== 'ADMIN' && role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ใช้งาน' }, { status: 403 })
    }

    const bookingId = params.id?.trim()
    if (!bookingId) {
      return NextResponse.json({ error: 'ไม่พบรหัสการจอง' }, { status: 400 })
    }

    const raw = await request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, depositSlipUrl: true },
    })
    if (!booking) {
      return NextResponse.json({ error: 'ไม่พบรายการจอง' }, { status: 404 })
    }
    if (!booking.depositSlipUrl) {
      return NextResponse.json({ error: 'ยังไม่มีการส่งสลิปมัดจำ' }, { status: 409 })
    }

    const isApprove = parsed.data.action === 'APPROVE'
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        depositVerificationStatus: isApprove ? 'APPROVED' : 'REJECTED',
        depositPaid: isApprove,
        depositPaidAt: isApprove ? new Date() : null,
        depositReviewedAt: new Date(),
        depositReviewNote: parsed.data.note?.trim() || null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 })
  }
}

