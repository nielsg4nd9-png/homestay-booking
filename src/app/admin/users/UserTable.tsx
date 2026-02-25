'use client'

import { useState } from 'react'
import type { User } from '@prisma/client'
import type { Role } from '@/lib/auth'
import { ROLES } from '@/lib/auth'
import { AdminTableCard } from '@/components/admin/AdminUI'

type UserForTable = Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'>

export function UserTable({ initialUsers }: { initialUsers: UserForTable[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleRoleChange(userId: string, role: Role) {
    setSavingId(userId)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) {
        throw new Error('Failed to update role')
      }
      const data = (await res.json()) as { id: string; role: Role }
      setUsers((prev) => prev.map((u) => (u.id === data.id ? { ...u, role: data.role } : u)))
    } catch {
      setError('ไม่สามารถอัปเดต role ได้')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <AdminTableCard>
      <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[620px]">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">อีเมล</th>
            <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">ชื่อ</th>
            <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">Role</th>
            <th className="text-left py-3.5 px-5 font-medium text-gray-700 whitespace-nowrap">สร้างเมื่อ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/60">
              <td className="py-3 px-5 text-gray-800 whitespace-nowrap">
                <span className="inline-block max-w-[260px] truncate align-bottom" title={u.email}>
                  {u.email}
                </span>
              </td>
              <td className="py-3 px-5 text-gray-600 whitespace-nowrap">{u.name || '-'}</td>
              <td className="py-3 px-5 whitespace-nowrap">
                <select
                  value={u.role as Role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                  disabled={savingId === u.id}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3 px-5 text-gray-500 whitespace-nowrap">
                {new Date(u.createdAt).toLocaleString('th-TH')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {users.length === 0 && (
        <div className="py-8 text-center text-gray-500 text-sm">ยังไม่มีผู้ใช้ในระบบ</div>
      )}
      {error && <div className="px-4 py-2 text-sm text-red-600 border-t border-red-100 bg-red-50">{error}</div>}
    </AdminTableCard>
  )
}

