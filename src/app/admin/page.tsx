import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  const [roomCount, bookingCount, userCount] = await Promise.all([
    prisma.room.count(),
    prisma.booking.count(),
    prisma.user.count(),
  ])

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { room: { select: { name: true, slug: true } } },
  })

  const roleLabel =
    (session?.user as { role?: string })?.role === 'ADMIN'
      ? 'แอดมิน'
      : (session?.user as { role?: string })?.role === 'EMPLOYEE'
        ? 'พนักงาน'
        : 'ผู้ใช้'

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">แดชบอร์ด</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base truncate">
          สวัสดี {session?.user?.name || session?.user?.email} ({roleLabel})
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Link
          href="/admin/rooms"
          className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
        >
          <p className="text-sm font-medium text-gray-500">ห้องพัก</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{roomCount}</p>
          <p className="text-xs text-emerald-600 mt-2">จัดการห้อง →</p>
        </Link>
        <Link
          href="/admin/bookings"
          className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
        >
          <p className="text-sm font-medium text-gray-500">รายการจอง</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{bookingCount}</p>
          <p className="text-xs text-emerald-600 mt-2">ดูรายการจอง →</p>
        </Link>
        <Link
          href="/admin/users"
          className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
        >
          <p className="text-sm font-medium text-gray-500">ผู้ใช้</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{userCount}</p>
          <p className="text-xs text-emerald-600 mt-2">จัดการผู้ใช้ →</p>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-3 sm:px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="font-semibold text-gray-800 text-sm sm:text-base">รายการจองล่าสุด</h2>
          <Link href="/admin/bookings" className="text-sm text-emerald-600 hover:underline shrink-0">
            ดูทั้งหมด
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">ยังไม่มีรายการจอง</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-2.5 px-4 font-medium text-gray-700">ผู้จอง</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-700">ห้อง</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-700">เช็คอิน - เช็คเอาท์</th>
                <th className="text-left py-2.5 px-4 font-medium text-gray-700">วันที่จอง</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-gray-50">
                  <td className="py-2.5 px-4 text-gray-800">{b.guestName}</td>
                  <td className="py-2.5 px-4">
                    <Link href={`/rooms/${b.room.slug}`} className="text-emerald-600 hover:underline">
                      {b.room.name}
                    </Link>
                  </td>
                  <td className="py-2.5 px-4 text-gray-600">
                    {b.checkIn.toLocaleDateString('th-TH')} – {b.checkOut.toLocaleDateString('th-TH')}
                  </td>
                  <td className="py-2.5 px-4 text-gray-500">
                    {b.createdAt.toLocaleString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
