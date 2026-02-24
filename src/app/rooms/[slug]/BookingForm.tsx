'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Room } from '@prisma/client'

export function BookingForm({
  room,
  defaultGuestName,
  defaultGuestEmail,
}: {
  room: Room
  defaultGuestName?: string
  defaultGuestEmail?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    const checkIn = formData.get('checkIn') as string
    const checkOut = formData.get('checkOut') as string
    const guestName = formData.get('guestName') as string
    const guestEmail = formData.get('guestEmail') as string
    const guestPhone = (formData.get('guestPhone') as string) || ''
    const guests = parseInt(formData.get('guests') as string, 10) || 1

    if (!checkIn || !checkOut || !guestName.trim() || !guestEmail.trim()) {
      setError('กรุณากรอกชื่อ อีเมล และวันเช็คอิน-เช็คเอาท์')
      return
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('วันเช็คเอาท์ต้องอยู่หลังวันเช็คอิน')
      return
    }
    if (guests > room.maxGuests) {
      setError(`จำนวนผู้เข้าพักสูงสุด ${room.maxGuests} คน`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          checkIn,
          checkOut,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim() || undefined,
          guests,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาดในการจอง')
        return
      }
      router.push(`/booking/success?id=${data.booking?.id ?? ''}`)
    } catch {
      setError('ไม่สามารถส่งคำจองได้ กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">วันเช็คอิน</label>
          <input
            type="date"
            name="checkIn"
            min={today}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">วันเช็คเอาท์</label>
          <input
            type="date"
            name="checkOut"
            min={today}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนผู้เข้าพัก</label>
        <input
          type="number"
          name="guests"
          min={1}
          max={room.maxGuests}
          defaultValue={1}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล *</label>
        <input
          type="text"
          name="guestName"
          required
          placeholder="ชื่อผู้จอง"
          defaultValue={defaultGuestName}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล *</label>
        <input
          type="email"
          name="guestEmail"
          required
          placeholder="email@example.com"
          defaultValue={defaultGuestEmail}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
        <input
          type="tel"
          name="guestPhone"
          placeholder="08x-xxx-xxxx"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'กำลังส่ง...' : 'ยืนยันการจอง'}
      </button>
    </form>
  )
}
