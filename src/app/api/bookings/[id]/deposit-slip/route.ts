import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  slipUrl: z.string().min(1),
})

type RouteParams = { params: { id: string } }

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.trim()
  if (!email) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })
  }

  const bookingId = params.id?.trim()
  if (!bookingId) {
    return NextResponse.json({ error: 'ไม่พบรหัสการจอง' }, { status: 400 })
  }

  try {
    const raw = await request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'ข้อมูลสลิปไม่ถูกต้อง' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, guestEmail: true, depositPaid: true },
    })
    if (!booking) {
      return NextResponse.json({ error: 'ไม่พบรายการจอง' }, { status: 404 })
    }
    if (booking.guestEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์อัปโหลดสลิปรายการนี้' }, { status: 403 })
    }
    if (booking.depositPaid) {
      return NextResponse.json({ error: 'รายการนี้ยืนยันชำระมัดจำแล้ว' }, { status: 409 })
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        depositSlipUrl: parsed.data.slipUrl,
        depositSlipSubmittedAt: new Date(),
        depositVerificationStatus: 'SUBMITTED',
        depositReviewedAt: null,
        depositReviewNote: null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 })
  }
}

