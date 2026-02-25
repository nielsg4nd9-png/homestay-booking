import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { DeleteRoomButton } from '../DeleteRoomButton'
import { AdminPageContainer, AdminPageHeader, AdminTableCard } from '@/components/admin/AdminUI'

export const dynamic = 'force-dynamic'

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { bookings: true } } },
  })

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="จัดการห้องพัก"
        description="รายการห้องพักทั้งหมดในระบบและจำนวนการจอง"
        actions={
          <Link
            href="/admin/rooms/new"
            className="py-2 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition text-center shrink-0"
          >
            เพิ่มห้อง
          </Link>
        }
      />

      <AdminTableCard>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[620px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ห้อง</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ราคา/คืน</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">จำนวนจอง</th>
              <th className="text-right py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                <td className="py-3 px-5 whitespace-nowrap">
                  <Link href={`/rooms/${room.slug}`} className="font-medium text-emerald-700 hover:underline whitespace-nowrap">
                    {room.name}
                  </Link>
                </td>
                <td className="py-3 px-5 text-gray-600 whitespace-nowrap">{formatPrice(room.pricePerNight)}</td>
                <td className="py-3 px-5 text-gray-600 whitespace-nowrap">{room._count.bookings} รายการ</td>
                <td className="py-3 px-5 text-right whitespace-nowrap">
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
      </AdminTableCard>
    </AdminPageContainer>
  )
}
