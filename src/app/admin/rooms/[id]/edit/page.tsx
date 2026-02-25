import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { RoomForm } from '../../../RoomForm'
import { AdminPageContainer, AdminPageHeader } from '@/components/admin/AdminUI'

export const dynamic = 'force-dynamic'

export default async function EditRoomPage({ params }: { params: { id: string } }) {
  const room = await prisma.room.findUnique({ where: { id: params.id } })
  if (!room) notFound()

  return (
    <AdminPageContainer>
      <AdminPageHeader title={`แก้ไขห้อง: ${room.name}`} />
      <div className="max-w-xl">
        <RoomForm room={room} />
      </div>
    </AdminPageContainer>
  )
}
