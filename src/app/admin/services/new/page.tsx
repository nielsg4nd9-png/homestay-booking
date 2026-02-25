import { ServiceForm } from '../ServiceForm'
import { AdminPageContainer, AdminPageHeader } from '@/components/admin/AdminUI'

export default function NewServicePage() {
  return (
    <AdminPageContainer>
      <AdminPageHeader title="เพิ่มสินค้า/บริการ" />
      <div className="max-w-xl">
        <ServiceForm />
      </div>
    </AdminPageContainer>
  )
}

