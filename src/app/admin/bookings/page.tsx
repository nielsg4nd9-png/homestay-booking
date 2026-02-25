import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { DepositStatusButton } from './DepositStatusButton'
import { DepositReviewActions } from './DepositReviewActions'
import { AdminPageContainer, AdminPageHeader, AdminTableCard } from '@/components/admin/AdminUI'

export const dynamic = 'force-dynamic'

type DepositFilter = 'all' | 'pending' | 'paid' | 'submitted'

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: { status?: string }
}) {
  const status = (searchParams?.status as DepositFilter | undefined) ?? 'all'
  const selectedStatus: DepositFilter =
    status === 'pending' || status === 'paid' || status === 'submitted' ? status : 'all'

  const [allCount, paidCount, submittedCount, paidRevenueAgg] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { depositPaid: true } }),
    prisma.booking.count({ where: { depositVerificationStatus: 'SUBMITTED' } }),
    prisma.booking.aggregate({
      where: { depositPaid: true },
      _sum: { totalPrice: true },
    }),
  ])
  const pendingCount = allCount - paidCount
  const paidRevenue = paidRevenueAgg._sum.totalPrice ?? 0

  const bookings = await prisma.booking.findMany({
    where:
      selectedStatus === 'all'
        ? undefined
        : selectedStatus === 'submitted'
          ? { depositVerificationStatus: 'SUBMITTED' }
          : {
              depositPaid: selectedStatus === 'paid',
            },
    orderBy: { createdAt: 'desc' },
    include: { room: { select: { name: true, slug: true } } },
  })

  const filterTabs: Array<{ key: DepositFilter; label: string; count: number; href: string; activeClass: string }> = [
    {
      key: 'all',
      label: 'ทั้งหมด',
      count: allCount,
      href: '/admin/bookings',
      activeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    {
      key: 'pending',
      label: 'ยังไม่ชำระมัดจำ',
      count: pendingCount,
      href: '/admin/bookings?status=pending',
      activeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    {
      key: 'submitted',
      label: 'รอตรวจสลิป',
      count: submittedCount,
      href: '/admin/bookings?status=submitted',
      activeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    {
      key: 'paid',
      label: 'ชำระมัดจำแล้ว',
      count: paidCount,
      href: '/admin/bookings?status=paid',
      activeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
  ]

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="รายงานการจอง"
        description="ติดตามสถานะการจองและการชำระมัดจำในหน้าเดียว"
      />

      <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">รายการจองทั้งหมด</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">{allCount}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-700">ยังไม่ชำระมัดจำ</p>
          <p className="mt-1 text-2xl font-bold text-amber-800">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs text-blue-700">รอตรวจสลิป</p>
          <p className="mt-1 text-2xl font-bold text-blue-800">{submittedCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">มูลค่ารายการที่ยืนยันมัดจำแล้ว</p>
          <p className="mt-1 text-lg font-bold text-emerald-800">{formatPrice(paidRevenue)}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              selectedStatus === tab.key
                ? tab.activeClass
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label} ({tab.count})
          </Link>
        ))}
      </div>

      <AdminTableCard>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1320px]">
          <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
            <tr>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ผู้จอง</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">อีเมล</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ห้อง</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">เช็คอิน</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">เช็คเอาท์</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">จำนวนคน</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ยอดรวม</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">มัดจำ 50%</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">สลิปมัดจำ</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">สถานะมัดจำ</th>
              <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">จองเมื่อ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/60 align-top">
                <td className="py-3 px-5 text-gray-800 whitespace-nowrap">{b.guestName}</td>
                <td className="py-3 px-5 text-gray-600 whitespace-nowrap">
                  <span className="inline-block max-w-[220px] truncate align-bottom" title={b.guestEmail}>
                    {b.guestEmail}
                  </span>
                </td>
                <td className="py-3 px-5 whitespace-nowrap">
                  <Link href={`/rooms/${b.room.slug}`} className="text-emerald-600 hover:underline whitespace-nowrap">
                    {b.room.name}
                  </Link>
                </td>
                <td className="py-3 px-5 text-gray-600 whitespace-nowrap">
                  {b.checkIn.toLocaleDateString('th-TH')}
                </td>
                <td className="py-3 px-5 text-gray-600 whitespace-nowrap">
                  {b.checkOut.toLocaleDateString('th-TH')}
                </td>
                <td className="py-3 px-5 text-gray-600 whitespace-nowrap">{b.guests}</td>
                <td className="py-3 px-5 text-gray-600 whitespace-nowrap">
                  {b.totalPrice != null ? formatPrice(b.totalPrice) : '-'}
                </td>
                <td className="py-3 px-5 text-gray-600 whitespace-nowrap">
                  {b.totalPrice != null ? formatPrice(Math.round(b.totalPrice * 0.5)) : '-'}
                </td>
                <td className="py-3 px-5 text-gray-600 whitespace-nowrap">
                  {b.depositSlipUrl ? (
                    <a
                      href={b.depositSlipUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-blue-700 hover:bg-blue-100"
                    >
                      ดูสลิป
                    </a>
                  ) : (
                    '-'
                  )}
                  {b.depositSlipSubmittedAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      ส่งเมื่อ {b.depositSlipSubmittedAt.toLocaleString('th-TH')}
                    </div>
                  )}
                </td>
                <td className="py-3 px-5 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        b.depositPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {b.depositPaid ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
                    </span>
                    {b.depositPaidAt && (
                      <span className="text-xs text-gray-500">
                        {b.depositPaidAt.toLocaleString('th-TH')}
                      </span>
                    )}
                    {b.depositVerificationStatus === 'SUBMITTED' && (
                      <span className="text-xs text-blue-700">รอตรวจสอบสลิป</span>
                    )}
                    {b.depositVerificationStatus === 'REJECTED' && (
                      <span className="text-xs text-red-700">สลิปถูกปฏิเสธ</span>
                    )}
                    {b.depositReviewNote && (
                      <span className="text-xs text-gray-500">หมายเหตุ: {b.depositReviewNote}</span>
                    )}
                    <DepositReviewActions bookingId={b.id} status={b.depositVerificationStatus} />
                    <DepositStatusButton
                      bookingId={b.id}
                      depositPaid={b.depositPaid}
                      disabled={b.depositVerificationStatus === 'SUBMITTED'}
                    />
                  </div>
                </td>
                <td className="py-3 px-5 text-gray-500 whitespace-nowrap">
                  {b.createdAt.toLocaleString('th-TH')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {bookings.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            {selectedStatus === 'all'
              ? 'ยังไม่มีรายการจอง'
              : selectedStatus === 'pending'
                ? 'ไม่พบรายการที่ยังไม่ชำระมัดจำ'
                : selectedStatus === 'submitted'
                  ? 'ไม่พบรายการที่รอตรวจสลิป'
                  : 'ไม่พบรายการที่ชำระมัดจำแล้ว'}
          </div>
        )}
      </AdminTableCard>
    </AdminPageContainer>
  )
}
