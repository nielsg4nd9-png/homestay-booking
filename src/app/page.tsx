import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, normalizeImageUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const rooms = await prisma.room.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <section className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">ยินดีต้อนรับโฮมสเตย์</h1>
        <p className="text-gray-600 text-sm sm:text-base">เลือกห้องที่ชอบ ตรวจวันว่าง แล้วจองออนไลน์ได้เลย</p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {rooms.map((room) => (
          <Link
            key={room.id}
            href={`/rooms/${room.slug}`}
            className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
          >
            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
              {normalizeImageUrl(room.imageUrl) ? (
                <img
                  src={normalizeImageUrl(room.imageUrl) as string}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                  {room.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-lg text-gray-800 group-hover:text-emerald-700">
                {room.name}
              </h2>
              <p className="text-gray-500 text-sm line-clamp-2 mt-1">{room.description}</p>
              <p className="mt-2 text-emerald-600 font-medium">
                {formatPrice(room.pricePerNight)} <span className="text-gray-500 font-normal text-sm">/ คืน</span>
              </p>
              <p className="text-sm text-gray-400">สูงสุด {room.maxGuests} คน</p>
            </div>
          </Link>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12 sm:py-16 text-gray-500 text-sm px-4">
          ยังไม่มีห้องพัก — เพิ่มห้องได้ที่{' '}
          <Link href="/admin/rooms" className="text-emerald-600 underline">จัดการห้อง</Link>
        </div>
      )}
    </div>
  )
}
