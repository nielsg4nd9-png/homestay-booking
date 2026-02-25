'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type ServiceItem = {
  id: string
  name: string
  slug: string
  type: string
  description: string | null
  imageUrl: string | null
  price: number | null
  unit: string | null
  isActive: boolean
  sortOrder: number
}

export function ServiceForm({ item }: { item?: ServiceItem | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(item?.name ?? '')
  const [slug, setSlug] = useState(item?.slug ?? '')
  const [type, setType] = useState<'SERVICE' | 'PRODUCT'>(
    item?.type === 'PRODUCT' ? 'PRODUCT' : 'SERVICE'
  )
  const [description, setDescription] = useState(item?.description ?? '')
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? '')
  const [price, setPrice] = useState(item?.price?.toString() ?? '')
  const [unit, setUnit] = useState(item?.unit ?? '')
  const [isActive, setIsActive] = useState(item?.isActive ?? true)
  const [sortOrder, setSortOrder] = useState(item?.sortOrder?.toString() ?? '0')

  useEffect(() => {
    if (item) return
    const nextSlug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9ก-๙\-]/g, '')
    if (nextSlug) setSlug(nextSlug)
  }, [name, item])

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
      name: name.trim(),
      slug: slug.trim(),
      type,
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      price: price.trim() ? parseInt(price, 10) : undefined,
      unit: unit.trim() || undefined,
      isActive,
      sortOrder: parseInt(sortOrder, 10) || 0,
    }

    if (!payload.name || !payload.slug) {
      setError('กรุณากรอกชื่อและ slug')
      return
    }

    setLoading(true)
    try {
      const url = item ? `/api/admin/services/${item.id}` : '/api/admin/services'
      const method = item ? 'PATCH' : 'POST'
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
      router.push('/admin/services')
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
        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า/บริการ *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          placeholder="coffee-set"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value === 'PRODUCT' ? 'PRODUCT' : 'SERVICE')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="SERVICE">บริการ</option>
            <option value="PRODUCT">สินค้า</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ลำดับการแสดงผล</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">หน่วย</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="แก้ว / ชุด / ท่าน"
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
        <p className="mt-1 text-xs text-gray-500">วาง URL รูป หรืออัปโหลดไฟล์รูปจากเครื่องด้านล่าง</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">อัปโหลดรูปภาพ</label>
        <input
          type="file"
          accept="image/*"
          disabled={uploadingImage}
          onChange={async (e) => {
            setError(null)
            await handleImageUpload(e.target.files?.[0])
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-emerald-700 hover:file:bg-emerald-100"
        />
        {uploadingImage && <p className="mt-1 text-xs text-emerald-700">กำลังอัปโหลดรูปภาพ...</p>}
      </div>

      {imageUrl && (
        <div className="rounded-lg border border-gray-200 p-2">
          <p className="text-xs text-gray-500 mb-2">พรีวิวรูปภาพ</p>
          <img src={imageUrl} alt="preview" className="w-full max-h-56 object-cover rounded-md" />
        </div>
      )}

      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        แสดงบนหน้าเว็บไซต์
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="py-2.5 px-5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {loading ? 'กำลังบันทึก...' : item ? 'อัปเดต' : 'เพิ่มรายการ'}
        </button>
        <Link
          href="/admin/services"
          className="py-2.5 px-5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          ยกเลิก
        </Link>
      </div>
    </form>
  )
}

