import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { DeleteRoomButton } from '../DeleteRoomButton'

export const dynamic = 'force-dynamic'

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { bookings: true } } },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">จัดการห้องพัก</h1>
        <Link
          href="/admin/rooms/new"
          className="py-2 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition text-center shrink-0"
        >
          เพิ่มห้อง
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700">ห้อง</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">ราคา/คืน</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">จำนวนจอง</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  <Link href={`/rooms/${room.slug}`} className="font-medium text-emerald-700 hover:underline">
                    {room.name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-gray-600">{formatPrice(room.pricePerNight)}</td>
                <td className="py-3 px-4 text-gray-600">{room._count.bookings} รายการ</td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/admin/rooms/${room.id}/edit`}
                    className="text-emerald-600 hover:underline mr-3"
                  >
                    แก้ไข
                  </Link>
                  <DeleteRoomButton roomId={room.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {rooms.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            ยังไม่มีห้อง — <Link href="/admin/rooms/new" className="text-emerald-600 underline">เพิ่มห้องแรก</Link>
          </div>
        )}
      </div>
    </div>
  )
}
