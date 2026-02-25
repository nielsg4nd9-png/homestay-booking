import { AdminPageContainer, AdminPageHeader } from '@/components/admin/AdminUI'
import { SlideForm } from '../SlideForm'

export default function NewSlidePage() {
  return (
    <AdminPageContainer>
      <AdminPageHeader title="เพิ่มสไลด์หน้าแรก" />
      <div className="max-w-xl">
        <SlideForm />
      </div>
    </AdminPageContainer>
  )
}

