import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminPageContainer, AdminPageHeader } from '@/components/admin/AdminUI'
import { SlideForm } from '../../SlideForm'

export const dynamic = 'force-dynamic'

export default async function EditSlidePage({ params }: { params: { id: string } }) {
  const slide = await prisma.heroSlide.findUnique({ where: { id: params.id } })
  if (!slide) notFound()

  return (
    <AdminPageContainer>
      <AdminPageHeader title={`แก้ไขสไลด์: ${slide.title || slide.id}`} />
      <div className="max-w-xl">
        <SlideForm slide={slide} />
      </div>
    </AdminPageContainer>
  )
}

