import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: { id: string } }

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  const id = params.id?.trim()
  if (!id) {
    return NextResponse.json({ error: 'ไม่พบรหัสการจอง' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.trim()
  if (!email) {
    return NextResponse.json(
      { error: 'กรุณาระบุอีเมลที่ใช้จอง' },
      { status: 400 }
    )
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      room: {
        select: {
          id: true,
          name: true,
          slug: true,
          pricePerNight: true,
          maxGuests: true,
        },
      },
    },
  })

  if (!booking) {
    return NextResponse.json(
      { error: 'ไม่พบรายการจองหรือรหัสการจองไม่ถูกต้อง' },
      { status: 404 }
    )
  }

  if (booking.guestEmail.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json(
      { error: 'อีเมลไม่ตรงกับข้อมูลการจอง' },
      { status: 403 }
    )
  }

  return NextResponse.json({
    id: booking.id,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    guests: booking.guests,
    totalPrice: booking.totalPrice,
    depositPaid: booking.depositPaid,
    depositPaidAt: booking.depositPaidAt?.toISOString() ?? null,
    depositSlipUrl: booking.depositSlipUrl,
    depositSlipSubmittedAt: booking.depositSlipSubmittedAt?.toISOString() ?? null,
    depositVerificationStatus: booking.depositVerificationStatus,
    depositReviewedAt: booking.depositReviewedAt?.toISOString() ?? null,
    depositReviewNote: booking.depositReviewNote,
    note: booking.note,
    createdAt: booking.createdAt.toISOString(),
    room: booking.room,
  })
}
