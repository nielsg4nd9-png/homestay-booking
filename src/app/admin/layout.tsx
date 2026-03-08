import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth-options'
import { AdminSignOutButton } from './AdminSignOutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role ?? 'USER'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-3 md:p-4 border-b border-gray-100 flex flex-row md:flex-col items-center md:items-stretch gap-2 md:gap-0">
          <Link href="/admin" className="text-base md:text-lg font-semibold text-emerald-800 shrink-0">
            หลังบ้าน
          </Link>
          <p className="text-xs text-gray-500 hidden md:block mt-1">เฉพาะ ADMIN / EMPLOYEE</p>
        </div>
        <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-0 md:gap-0 p-0 md:p-2 border-b md:border-b-0 border-gray-100">
          <Link
            href="/admin"
            className="shrink-0 px-3 py-2.5 md:py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-none md:rounded-lg transition"
          >
            แดชบอร์ด
          </Link>
          <Link
            href="/admin/rooms"
            className="shrink-0 px-3 py-2.5 md:py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-none md:rounded-lg transition"
          >
            จัดการห้องพัก
          </Link>
          <Link
            href="/admin/bookings"
            className="shrink-0 px-3 py-2.5 md:py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-none md:rounded-lg transition"
          >
            รายการจอง
          </Link>
          <Link
            href="/admin/services"
            className="shrink-0 px-3 py-2.5 md:py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-none md:rounded-lg transition"
          >
            สินค้าและบริการ
          </Link>
          <Link
            href="/admin/slides"
            className="shrink-0 px-3 py-2.5 md:py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-none md:rounded-lg transition"
          >
            สไลด์หน้าแรก
          </Link>
          <Link
            href="/admin/users"
            className="shrink-0 px-3 py-2.5 md:py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-none md:rounded-lg transition"
          >
            จัดการผู้ใช้
          </Link>
        </nav>
        <div className="p-2 border-t border-gray-100 hidden md:block">
          <div className="px-3 py-2 text-xs text-gray-500 truncate" title={session?.user?.email ?? ''}>
            {session?.user?.email}
          </div>
          <div className="px-3 py-0.5 text-xs text-gray-400">
            {role === 'ADMIN' ? 'แอดมิน' : role === 'EMPLOYEE' ? 'พนักงาน' : 'ผู้ใช้'}
          </div>
          <AdminSignOutButton />
        </div>
        <div className="p-2 md:hidden border-t border-gray-100">
          <AdminSignOutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
