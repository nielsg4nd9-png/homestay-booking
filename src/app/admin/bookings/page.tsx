import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: { room: { select: { name: true, slug: true } } },
  })

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">รายการจอง</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700">ผู้จอง</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">อีเมล</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">ห้อง</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">เช็คอิน</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">เช็คเอาท์</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">จำนวนคน</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">จองเมื่อ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-2.5 px-4 text-gray-800">{b.guestName}</td>
                <td className="py-2.5 px-4 text-gray-600">{b.guestEmail}</td>
                <td className="py-2.5 px-4">
                  <Link href={`/rooms/${b.room.slug}`} className="text-emerald-600 hover:underline">
                    {b.room.name}
                  </Link>
                </td>
                <td className="py-2.5 px-4 text-gray-600">
                  {b.checkIn.toLocaleDateString('th-TH')}
                </td>
                <td className="py-2.5 px-4 text-gray-600">
                  {b.checkOut.toLocaleDateString('th-TH')}
                </td>
                <td className="py-2.5 px-4 text-gray-600">{b.guests}</td>
                <td className="py-2.5 px-4 text-gray-500">
                  {b.createdAt.toLocaleString('th-TH')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {bookings.length === 0 && (
          <div className="py-12 text-center text-gray-500">ยังไม่มีรายการจอง</div>
        )}
      </div>
    </div>
  )
}
