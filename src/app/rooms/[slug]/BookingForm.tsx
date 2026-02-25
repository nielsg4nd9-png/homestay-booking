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
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const today = new Date().toISOString().slice(0, 10)
  const pricePerNight = room.pricePerNight

  const nights = getNights(checkIn, checkOut)
  const totalPrice = nights > 0 ? nights * pricePerNight : null
  const deposit = totalPrice != null ? Math.round(totalPrice * 0.5) : null
  const remaining = totalPrice != null && deposit != null ? totalPrice - deposit : null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    const checkIn = formData.get('checkIn') as string
    const checkOut = formData.get('checkOut') as string
    const guestName = formData.get('guestName') as string
    const guestPhone = (formData.get('guestPhone') as string) || ''
    const guests = parseInt(formData.get('guests') as string, 10) || 1

    if (!checkIn || !checkOut || !guestName.trim()) {
      setError('กรุณากรอกชื่อ และวันเช็คอิน-เช็คเอาท์')
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
          // guestEmail จะยึดตามบัญชีที่ล็อกอินจากฝั่งเซิร์ฟเวอร์
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
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
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
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
      {totalPrice != null && deposit != null && remaining != null && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          <p className="font-medium">สรุปค่าบริการโดยประมาณ</p>
          <p className="mt-1">
            จำนวนคืน: <span className="font-semibold">{nights}</span> คืน
          </p>
          <p>
            ยอดรวม: <span className="font-semibold">{new Intl.NumberFormat('th-TH').format(totalPrice)} บาท</span>
          </p>
          <p>
            มัดจำ 50%: <span className="font-semibold">{new Intl.NumberFormat('th-TH').format(deposit)} บาท</span>
          </p>
          <p>
            คงเหลือ: <span className="font-semibold">{new Intl.NumberFormat('th-TH').format(remaining)} บาท</span>
          </p>
        </div>
      )}
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
          placeholder="email@example.com"
          defaultValue={defaultGuestEmail}
          disabled
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <p className="mt-1 text-xs text-gray-500">อีเมลจะยึดจากบัญชีที่ล็อกอิน</p>
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
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <p className="font-medium">การชำระค่าบริการ</p>
        <p className="mt-1">1) ค่ามัดจำ 50% ของค่าบริการทั้งหมด ชำระหลังจากทำการจอง</p>
        <p>2) ค่าบริการส่วนที่เหลือ 50% ชำระตามกำหนดของที่พัก</p>
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

function getNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const inDate = parseLocalDate(checkIn)
  const outDate = parseLocalDate(checkOut)
  if (!inDate || !outDate) return 0
  const diffMs = outDate.getTime() - inDate.getTime()
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
}

function parseLocalDate(value: string): Date | null {
  const parts = value.split('-').map((s) => Number(s))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null
  const [year, month, day] = parts
  return new Date(year, month - 1, day)
}
