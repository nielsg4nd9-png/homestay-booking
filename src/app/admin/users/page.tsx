import { prisma } from '@/lib/prisma'
import { UserTable } from './UserTable'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">จัดการผู้ใช้</h1>
        <p className="text-sm text-gray-500">เฉพาะแอดมินเท่านั้นที่แก้ role ได้</p>
      </div>
      <UserTable initialUsers={users} />
    </div>
  )
}

