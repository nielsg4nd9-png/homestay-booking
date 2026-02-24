import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { RoomForm } from '../../../RoomForm'

export const dynamic = 'force-dynamic'

export default async function EditRoomPage({ params }: { params: { id: string } }) {
  const room = await prisma.room.findUnique({ where: { id: params.id } })
  if (!room) notFound()

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">แก้ไขห้อง: {room.name}</h1>
      <RoomForm room={room} />
    </div>
  )
}
