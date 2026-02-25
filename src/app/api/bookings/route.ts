import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { differenceInDays } from 'date-fns'
import { z } from 'zod'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const bodySchema = z.object({
  roomId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guestName: z.string().min(1),
  guestPhone: z.string().optional(),
  guests: z.number().int().min(1).optional(),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { error: 'กรุณาเข้าสู่ระบบเพื่อทำการจอง' },
      { status: 401 }
    )
  }

  try {
    const raw = await request.json()
    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบหรือรูปแบบไม่ถูกต้อง' },
        { status: 400 }
      )
    }
    const { roomId, checkIn, checkOut, guestName, guestPhone, guests } = parsed.data

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: 'วันเช็คเอาท์ต้องอยู่หลังวันเช็คอิน' },
        { status: 400 }
      )
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) {
      return NextResponse.json({ error: 'ไม่พบห้องพัก' }, { status: 404 })
    }

    const numGuests = guests ?? 1
    if (numGuests > room.maxGuests) {
      return NextResponse.json(
        { error: `จำนวนผู้เข้าพักสูงสุด ${room.maxGuests} คน` },
        { status: 400 }
      )
    }

    const overlapping = await prisma.booking.findFirst({
      where: {
        roomId,
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
    })
    if (overlapping) {
      return NextResponse.json(
        { error: 'ช่วงวันที่เลือกมีการจองซ้อนกัน กรุณาเลือกวันอื่น' },
        { status: 409 }
      )
    }

    const nights = Math.max(1, differenceInDays(checkOutDate, checkInDate))
    const totalPrice = room.pricePerNight * nights

    const sessionEmail = session.user?.email?.trim()
    if (!sessionEmail) {
      return NextResponse.json(
        { error: 'ไม่พบอีเมลในบัญชีผู้ใช้ กรุณาเข้าสู่ระบบใหม่' },
        { status: 400 }
      )
    }
    const finalGuestName = session.user?.name?.trim() || guestName

    const booking = await prisma.booking.create({
      data: {
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guestName: finalGuestName,
        guestEmail: sessionEmail,
        guestPhone: guestPhone || null,
        guests: numGuests,
        totalPrice,
      },
    })

    return NextResponse.json({ booking: { id: booking.id } })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    )
  }
}
