'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Room } from '@prisma/client'

function amenityString(amenities: string | null): string {
  if (!amenities) return ''
  try {
    const arr = JSON.parse(amenities) as unknown
    return Array.isArray(arr) ? (arr as string[]).join(', ') : ''
  } catch {
    return ''
  }
}

export function RoomForm({ room }: { room?: Room | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(room?.name ?? '')
  const [slug, setSlug] = useState(room?.slug ?? '')
  const [description, setDescription] = useState(room?.description ?? '')
  const [pricePerNight, setPricePerNight] = useState(room?.pricePerNight?.toString() ?? '')
  const [maxGuests, setMaxGuests] = useState(room?.maxGuests?.toString() ?? '2')
  const [imageUrl, setImageUrl] = useState(room?.imageUrl ?? '')
  const [amenitiesText, setAmenitiesText] = useState(amenityString(room?.amenities))

  useEffect(() => {
    if (room) return
    const s = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9ก-๙\-]/g, '')
    if (s) setSlug(s)
  }, [name, room])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const amenities = amenitiesText
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter(Boolean)
    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      pricePerNight: parseInt(pricePerNight, 10) || 0,
      maxGuests: parseInt(maxGuests, 10) || 1,
      imageUrl: imageUrl.trim() || undefined,
      amenities: amenities.length ? JSON.stringify(amenities) : undefined,
    }

    setLoading(true)
    try {
      const url = room ? `/api/admin/rooms/${room.id}` : '/api/admin/rooms'
      const method = room ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด')
        return
      }
      router.push('/admin/rooms')
      router.refresh()
    } catch {
      setError('ไม่สามารถบันทึกได้')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อห้อง *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (ใช้ใน URL) *</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          placeholder="garden-room"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ราคา/คืน (บาท) *</label>
          <input
            type="number"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            min={0}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนคนสูงสุด *</label>
          <input
            type="number"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            min={1}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">สิ่งอำนวยความสะดวก (คั่นด้วย comma)</label>
        <input
          type="text"
          value={amenitiesText}
          onChange={(e) => setAmenitiesText(e.target.value)}
          placeholder="WiFi, แอร์, ทีวี"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="py-2.5 px-5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {loading ? 'กำลังบันทึก...' : room ? 'อัปเดต' : 'เพิ่มห้อง'}
        </button>
        <Link
          href="/admin/rooms"
          className="py-2.5 px-5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          ยกเลิก
        </Link>
      </div>
    </form>
  )
}
