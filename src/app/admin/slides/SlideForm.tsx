'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type HeroSlide = {
  id: string
  title: string | null
  subtitle: string | null
  imageUrl: string
  isActive: boolean
  sortOrder: number
}

export function SlideForm({ slide }: { slide?: HeroSlide | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(slide?.title ?? '')
  const [subtitle, setSubtitle] = useState(slide?.subtitle ?? '')
  const [imageUrl, setImageUrl] = useState(slide?.imageUrl ?? '')
  const [isActive, setIsActive] = useState(slide?.isActive ?? true)
  const [sortOrder, setSortOrder] = useState(slide?.sortOrder?.toString() ?? '0')

  async function handleImageUpload(file: File | undefined) {
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

    setUploadingImage(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'อัปโหลดรูปไม่สำเร็จ')
        return
      }
      setImageUrl(data.url || '')
    } catch {
      setError('อัปโหลดรูปไม่สำเร็จ')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const payload = {
      title: title.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      imageUrl: imageUrl.trim(),
      isActive,
      sortOrder: parseInt(sortOrder, 10) || 0,
    }

    if (!payload.imageUrl) {
      setError('กรุณาใส่รูปสไลด์')
      return
    }

    setLoading(true)
    try {
      const url = slide ? `/api/admin/slides/${slide.id}` : '/api/admin/slides'
      const method = slide ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'บันทึกไม่สำเร็จ')
        return
      }
      router.push('/admin/slides')
      router.refresh()
    } catch {
      setError('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อ (ไม่บังคับ)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="เช่น กาแฟ บ้านสวน โฮมสเตย์"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย (ไม่บังคับ)</label>
        <textarea
          rows={2}
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="ข้อความสั้นบนสไลด์"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ *</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="/uploads/hero-1.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">อัปโหลดรูปภาพ</label>
        <input
          type="file"
          accept="image/*"
          disabled={uploadingImage}
          onChange={(e) => void handleImageUpload(e.target.files?.[0])}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-emerald-700 hover:file:bg-emerald-100"
        />
        {uploadingImage && <p className="mt-1 text-xs text-emerald-700">กำลังอัปโหลดรูปภาพ...</p>}
      </div>

      {imageUrl && (
        <div className="rounded-lg border border-gray-200 p-2">
          <p className="text-xs text-gray-500 mb-2">พรีวิวสไลด์</p>
          <img src={imageUrl} alt="slide preview" className="w-full max-h-56 object-cover rounded-md" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ลำดับการแสดงผล</label>
          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700 sm:pt-8">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          แสดงบนหน้าแรก
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="py-2.5 px-5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {loading ? 'กำลังบันทึก...' : slide ? 'อัปเดตสไลด์' : 'เพิ่มสไลด์'}
        </button>
        <Link
          href="/admin/slides"
          className="py-2.5 px-5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          ยกเลิก
        </Link>
      </div>
    </form>
  )
}

