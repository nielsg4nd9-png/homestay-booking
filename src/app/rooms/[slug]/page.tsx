import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { formatPrice, normalizeImageUrl, parseAmenities } from '@/lib/utils'
import { BookingForm } from './BookingForm'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'

export default async function RoomPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  const room = await prisma.room.findUnique({ where: { slug: params.slug } })
  if (!room) notFound()

  const amenities = parseAmenities(room.amenities)
  const imageSrc = normalizeImageUrl(room.imageUrl)

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="aspect-[16/9] bg-gray-200">
          {imageSrc ? (
            <img src={imageSrc} alt={room.name} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(https://placehold.co/800x450/e8f5e9/2e7d32?text=${encodeURIComponent(room.name)})`,
              }}
            />
          )}
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
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm text-center">
            <p className="text-gray-600 mb-4">กรุณาเข้าสู่ระบบเพื่อทำการจองห้อง</p>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(`/rooms/${params.slug}`)}`}
              className="inline-block py-2.5 px-5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
