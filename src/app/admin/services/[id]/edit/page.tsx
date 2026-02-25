import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ServiceForm } from '../../ServiceForm'
import { AdminPageContainer, AdminPageHeader } from '@/components/admin/AdminUI'

export const dynamic = 'force-dynamic'

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const item = await prisma.serviceItem.findUnique({ where: { id: params.id } })
  if (!item) notFound()

  return (
    <AdminPageContainer>
      <AdminPageHeader title={`แก้ไขรายการ: ${item.name}`} />
      <div className="max-w-xl">
        <ServiceForm item={item} />
      </div>
    </AdminPageContainer>
  )
}

