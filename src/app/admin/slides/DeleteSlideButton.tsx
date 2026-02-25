'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Swal from 'sweetalert2'

export function DeleteSlideButton({ slideId }: { slideId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmResult = await Swal.fire({
      icon: 'warning',
      title: 'ยืนยันลบสไลด์นี้?',
      text: 'การลบไม่สามารถย้อนกลับได้',
      showCancelButton: true,
      confirmButtonText: 'ลบสไลด์',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#dc2626',
    })
    if (!confirmResult.isConfirmed) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/slides/${slideId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        await Swal.fire({ icon: 'error', title: 'ลบไม่สำเร็จ', text: data.error || 'เกิดข้อผิดพลาด' })
        return
      }
      await Swal.fire({ icon: 'success', title: 'ลบสไลด์แล้ว', timer: 1000, showConfirmButton: false })
      router.refresh()
    } catch {
      await Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาลองใหม่อีกครั้ง' })
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

