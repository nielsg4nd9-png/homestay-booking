import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { formatPrice, parseAmenities } from '@/lib/utils'
import { BookingForm } from './BookingForm'
import { authOptions } from '@/lib/auth-options'
import { RoomImage } from '@/components/RoomImage'

export const dynamic = 'force-dynamic'

export default async function RoomPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  const room = await prisma.room.findUnique({ where: { slug: params.slug } })
  if (!room) notFound()

  const amenities = parseAmenities(room.amenities)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
        <div className="aspect-[16/9] bg-gray-200">
          <RoomImage
            imageUrl={room.imageUrl}
            roomName={room.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800">{room.name}</h1>
          <p className="text-emerald-600 font-medium mt-1">
            {formatPrice(room.pricePerNight)} / คืน · สูงสุด {room.maxGuests} คน
          </p>
          {room.description && (
            <p className="text-gray-600 mt-4">{room.description}</p>
          )}
          {amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">จองห้องนี้</h2>
        {session ? (
          <BookingForm
            room={room}
            defaultGuestName={session.user?.name ?? undefined}
            defaultGuestEmail={session.user?.email ?? undefined}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm text-center">
            <p className="text-gray-600 mb-4">กรุณาเข้าสู่ระบบเพื่อทำการจองห้อง</p>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(`/rooms/${params.slug}`)}`}
              className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-sm hover:bg-emerald-700 transition"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
