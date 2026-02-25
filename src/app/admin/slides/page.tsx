import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { AdminPageContainer, AdminPageHeader, AdminTableCard } from '@/components/admin/AdminUI'
import { DeleteSlideButton } from './DeleteSlideButton'

export const dynamic = 'force-dynamic'

export default async function AdminSlidesPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="จัดการสไลด์หน้าแรก"
        description="จัดการรูปพื้นหลังสไลด์ในส่วน Hero หน้าแรก"
        actions={
          <Link
            href="/admin/slides/new"
            className="py-2 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition text-center shrink-0"
          >
            เพิ่มสไลด์
          </Link>
        }
      />

      <AdminTableCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[880px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">รูปตัวอย่าง</th>
                <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">หัวข้อ</th>
                <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">สถานะ</th>
                <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ลำดับ</th>
                <th className="text-right py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr key={slide.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="py-3 px-5">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || 'slide'}
                      className="h-14 w-24 rounded-md object-cover border border-gray-200"
                    />
                  </td>
                  <td className="py-3 px-5 text-gray-700">
                    <p className="font-medium">{slide.title || '-'}</p>
                    {slide.subtitle && (
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{slide.subtitle}</p>
                    )}
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        slide.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {slide.isActive ? 'แสดงผล' : 'ซ่อน'}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-600 whitespace-nowrap">{slide.sortOrder}</td>
                  <td className="py-3 px-5 text-right whitespace-nowrap">
                    <Link href={`/admin/slides/${slide.id}/edit`} className="text-emerald-600 hover:underline mr-3">
                      แก้ไข
                    </Link>
                    <DeleteSlideButton slideId={slide.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {slides.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            ยังไม่มีสไลด์ —{' '}
            <Link href="/admin/slides/new" className="text-emerald-600 underline">
              เพิ่มสไลด์แรก
            </Link>
          </div>
        )}
      </AdminTableCard>
    </AdminPageContainer>
  )
}

