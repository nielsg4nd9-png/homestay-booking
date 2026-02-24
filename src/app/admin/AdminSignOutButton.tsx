'use client'

import { signOut } from 'next-auth/react'

export function AdminSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition"
    >
      ออกจากระบบ
    </button>
  )
}
