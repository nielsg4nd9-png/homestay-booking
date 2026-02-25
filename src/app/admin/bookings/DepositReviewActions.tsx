'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Swal from 'sweetalert2'

export function DepositReviewActions({
  bookingId,
  status,
}: {
  bookingId: string
  status: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function submit(action: 'APPROVE' | 'REJECT') {
    const confirmResult = await Swal.fire({
      icon: action === 'APPROVE' ? 'question' : 'warning',
      title: action === 'APPROVE' ? 'ยืนยันอนุมัติสลิป?' : 'ยืนยันปฏิเสธสลิป?',
      input: 'textarea',
      inputLabel: action === 'APPROVE' ? 'หมายเหตุ (ไม่บังคับ)' : 'เหตุผลที่ปฏิเสธ (ไม่บังคับ)',
      inputPlaceholder: action === 'APPROVE' ? 'เช่น สลิปถูกต้อง' : 'เช่น ยอดเงินไม่ตรง',
      showCancelButton: true,
      confirmButtonText: action === 'APPROVE' ? 'อนุมัติ' : 'ปฏิเสธ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: action === 'APPROVE' ? '#059669' : '#dc2626',
    })
    if (!confirmResult.isConfirmed) return
    const note = String(confirmResult.value || '')

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/deposit-review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note }),
      })
      const data = await res.json()
      if (!res.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'อัปเดตสถานะไม่สำเร็จ',
          text: data.error || 'เกิดข้อผิดพลาด',
        })
        return
      }
      await Swal.fire({
        icon: 'success',
        title: action === 'APPROVE' ? 'อนุมัติสลิปเรียบร้อย' : 'ปฏิเสธสลิปเรียบร้อย',
        timer: 1200,
        showConfirmButton: false,
      })
      router.refresh()
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณาลองใหม่อีกครั้ง',
      })
    } finally {
      setLoading(false)
    }
  }

  if (status !== 'SUBMITTED' && status !== 'REJECTED') return null

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => void submit('APPROVE')}
        className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-50"
      >
        อนุมัติสลิป
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => void submit('REJECT')}
        className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
      >
        ปฏิเสธสลิป
      </button>
    </div>
  )
}

