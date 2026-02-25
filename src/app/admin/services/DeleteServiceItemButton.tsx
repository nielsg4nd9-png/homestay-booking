'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteServiceItemButton({ itemId }: { itemId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('ต้องการลบรายการนี้ใช่หรือไม่?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/services/${itemId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'ลบไม่สำเร็จ')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? 'กำลังลบ...' : 'ลบ'}
    </button>
  )
}

