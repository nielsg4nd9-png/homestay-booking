import { prisma } from '@/lib/prisma'
import { UserTable } from './UserTable'
import { AdminPageContainer, AdminPageHeader } from '@/components/admin/AdminUI'

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
    <AdminPageContainer className="space-y-4">
      <AdminPageHeader
        title="จัดการผู้ใช้"
        description="เฉพาะแอดมินเท่านั้นที่แก้ role ได้"
        className="mb-1"
      />
      <UserTable initialUsers={users} />
    </AdminPageContainer>
  )
}

