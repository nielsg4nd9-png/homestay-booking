'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

const BANK_NAME = process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME?.trim() || ''
const ACCOUNT_NAME = process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME?.trim() || ''
const ACCOUNT_NO = process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NO?.trim() || ''
const PROMPTPAY_NO = process.env.NEXT_PUBLIC_PAYMENT_PROMPTPAY_NO?.trim() || ''
const PROMPTPAY_QR_IMAGE_URL = process.env.NEXT_PUBLIC_PAYMENT_QR_IMAGE_URL?.trim() || ''

export function DepositSlipUploader({
  bookingId,
  depositAmount,
}: {
  bookingId: string
  depositAmount: number | null
}) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slipUrl, setSlipUrl] = useState('')

  async function handleFileChange(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น')
      return
    }
    const maxBytes = 2 * 1024 * 1024
    if (file.size > maxBytes) {
      setError('รูปภาพต้องมีขนาดไม่เกิน 2MB')
      return
    }

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'อัปโหลดสลิปไม่สำเร็จ')
        return
      }
      setSlipUrl(data.url || '')
    } catch {
      setError('อัปโหลดสลิปไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  async function submitSlip() {
    if (!slipUrl) {
      setError('กรุณาอัปโหลดสลิปก่อน')
      return
    }
    const confirmResult = await Swal.fire({
      icon: 'question',
      title: 'ยืนยันส่งสลิปมัดจำ?',
      text: 'หลังส่งแล้ว ระบบจะรอแอดมินตรวจสอบ',
      showCancelButton: true,
      confirmButtonText: 'ส่งสลิป',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d97706',
    })
    if (!confirmResult.isConfirmed) return

    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/deposit-slip`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slipUrl }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'ส่งสลิปไม่สำเร็จ')
        await Swal.fire({
          icon: 'error',
          title: 'ส่งสลิปไม่สำเร็จ',
          text: data.error || 'กรุณาลองใหม่อีกครั้ง',
        })
        return
      }
      await Swal.fire({
        icon: 'success',
        title: 'ส่งสลิปเรียบร้อย',
        timer: 1200,
        showConfirmButton: false,
      })
      router.refresh()
    } catch {
      setError('ส่งสลิปไม่สำเร็จ')
      await Swal.fire({
        icon: 'error',
        title: 'ส่งสลิปไม่สำเร็จ',
        text: 'กรุณาลองใหม่อีกครั้ง',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
      <p className="text-sm font-medium text-amber-900">อัปโหลดสลิปค่ามัดจำ</p>
      <div className="rounded-md border border-amber-200 bg-white p-2 text-xs text-gray-700 space-y-1">
        <p className="font-medium text-gray-900">ช่องทางชำระเงิน</p>
        {depositAmount != null && (
          <p>
            ยอดมัดจำที่ต้องโอน: <span className="font-semibold">{new Intl.NumberFormat('th-TH').format(depositAmount)} บาท</span>
          </p>
        )}
        <p>
          อ้างอิงการโอน: <span className="font-semibold">{bookingId}</span>
        </p>
        {BANK_NAME && ACCOUNT_NAME && ACCOUNT_NO && (
          <div className="pt-1">
            <p>ธนาคาร: {BANK_NAME}</p>
            <p>ชื่อบัญชี: {ACCOUNT_NAME}</p>
            <p>
              เลขบัญชี: {ACCOUNT_NO}{' '}
              <button
                type="button"
                onClick={() => void copyText(ACCOUNT_NO)}
                className="text-blue-600 hover:underline"
              >
                คัดลอก
              </button>
            </p>
          </div>
        )}
        {PROMPTPAY_NO && (
          <p>
            พร้อมเพย์: {PROMPTPAY_NO}{' '}
            <button
              type="button"
              onClick={() => void copyText(PROMPTPAY_NO)}
              className="text-blue-600 hover:underline"
            >
              คัดลอก
            </button>
          </p>
        )}
        {PROMPTPAY_QR_IMAGE_URL && (
          <div className="pt-1">
            <p className="mb-1">QR พร้อมเพย์</p>
            <img
              src={PROMPTPAY_QR_IMAGE_URL}
              alt="promptpay qr"
              className="max-h-56 w-full object-contain rounded-md border border-gray-200 bg-white"
            />
          </div>
        )}
        {!BANK_NAME && !PROMPTPAY_NO && (
          <p className="text-amber-700">ยังไม่ได้ตั้งค่าช่องทางชำระเงิน กรุณาติดต่อแอดมินผ่านเพจเพื่อรับบัญชีโอน</p>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        disabled={uploading || saving}
        onChange={(e) => void handleFileChange(e.target.files?.[0])}
        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-amber-100 file:px-3 file:py-1.5 file:text-amber-900 hover:file:bg-amber-200"
      />
      {uploading && <p className="text-xs text-amber-800">กำลังอัปโหลดสลิป...</p>}
      {slipUrl && (
        <div className="rounded-md border border-amber-200 bg-white p-2">
          <p className="text-xs text-gray-500 mb-2">พรีวิวสลิป</p>
          <img src={slipUrl} alt="slip preview" className="max-h-56 w-full object-contain rounded-md bg-gray-50" />
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="button"
        disabled={saving || uploading}
        onClick={submitSlip}
        className="rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {saving ? 'กำลังส่งสลิป...' : 'ส่งสลิปให้แอดมินตรวจสอบ'}
      </button>
    </div>
  )
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    await Swal.fire({
      icon: 'success',
      title: 'คัดลอกแล้ว',
      timer: 900,
      showConfirmButton: false,
    })
  } catch {
    await Swal.fire({
      icon: 'error',
      title: 'คัดลอกไม่สำเร็จ',
    })
  }
}

