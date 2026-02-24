import { RoomForm } from '../../RoomForm'

export default function NewRoomPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">เพิ่มห้องพัก</h1>
      <RoomForm />
    </div>
  )
}
