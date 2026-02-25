import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { DeleteServiceItemButton } from './DeleteServiceItemButton'
import { AdminPageContainer, AdminPageHeader, AdminTableCard } from '@/components/admin/AdminUI'

export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
  const items = await prisma.serviceItem.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="จัดการสินค้าและบริการ"
        description="จัดการรายการสินค้า/บริการที่จะแสดงบนหน้าเว็บไซต์"
        actions={
          <Link
            href="/admin/services/new"
            className="py-2 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition text-center shrink-0"
          >
            เพิ่มรายการ
          </Link>
        }
      />

      <AdminTableCard>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ชื่อรายการ</th>
                <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ประเภท</th>
                <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ราคา</th>
                <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">สถานะ</th>
                <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ลำดับ</th>
                <th className="text-right py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="py-3 px-5">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">slug: {item.slug}</p>
                  </td>
                  <td className="py-3 px-5 text-gray-600 whitespace-nowrap">
                    {item.type === 'PRODUCT' ? 'สินค้า' : 'บริการ'}
                  </td>
                  <td className="py-3 px-5 text-gray-600 whitespace-nowrap">
                    {item.price != null ? `${formatPrice(item.price)}${item.unit ? ` / ${item.unit}` : ''}` : '-'}
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.isActive ? 'แสดงผล' : 'ซ่อน'}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-600 whitespace-nowrap">{item.sortOrder}</td>
                  <td className="py-3 px-5 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/services/${item.id}/edit`}
                      className="text-emerald-600 hover:underline mr-3"
                    >
                      แก้ไข
                    </Link>
                    <DeleteServiceItemButton itemId={item.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            ยังไม่มีรายการ —{' '}
            <Link href="/admin/services/new" className="text-emerald-600 underline">
              เพิ่มรายการแรก
            </Link>
          </div>
        )}
      </AdminTableCard>
    </AdminPageContainer>
  )
}

