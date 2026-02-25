import { RoomForm } from '../../RoomForm'
import { AdminPageContainer, AdminPageHeader } from '@/components/admin/AdminUI'

export default function NewRoomPage() {
  return (
    <AdminPageContainer>
      <AdminPageHeader title="เพิ่มห้องพัก" />
      <div className="max-w-xl">
        <RoomForm />
      </div>
    </AdminPageContainer>
  )
}
