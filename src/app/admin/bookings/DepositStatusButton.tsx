'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Swal from 'sweetalert2'

export function DepositStatusButton({
  bookingId,
  depositPaid,
  disabled,
}: {
  bookingId: string
  depositPaid: boolean
  disabled?: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    const nextPaid = !depositPaid
    const confirmResult = await Swal.fire({
      icon: 'question',
      title: nextPaid ? 'ยืนยันการรับชำระมัดจำ?' : 'เปลี่ยนกลับเป็นยังไม่ชำระ?',
      text: nextPaid
        ? 'ระบบจะบันทึกว่าลูกค้าชำระมัดจำแล้ว'
        : 'ระบบจะยกเลิกสถานะชำระมัดจำของรายการนี้',
      showCancelButton: true,
      confirmButtonText: nextPaid ? 'ยืนยัน' : 'เปลี่ยนสถานะ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: nextPaid ? '#059669' : '#d97706',
    })
    if (!confirmResult.isConfirmed) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/deposit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositPaid: nextPaid }),
      })
      if (!res.ok) {
        const data = await res.json()
        await Swal.fire({
          icon: 'error',
          title: 'อัปเดตสถานะไม่สำเร็จ',
          text: data.error || 'เกิดข้อผิดพลาด',
        })
        return
      }
      await Swal.fire({
        icon: 'success',
        title: 'อัปเดตสถานะเรียบร้อย',
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

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading || disabled}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
        depositPaid
          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
      } disabled:opacity-50`}
    >
      {loading ? 'กำลังอัปเดต...' : depositPaid ? 'เปลี่ยนเป็นยังไม่ชำระ' : 'ยืนยันชำระมัดจำ'}
    </button>
  )
}

