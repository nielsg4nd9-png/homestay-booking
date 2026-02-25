import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(baht: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(baht) + ' บาท'
}

export function normalizeImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null
  const u = imageUrl.trim()
  if (!u) return null
  if (/^(data:|blob:)/i.test(u)) return u
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('/')) return u
  return `/${u}`
}

export function parseAmenities(amenities: string | null): string[] {
  if (!amenities) return []
  try {
    const arr = JSON.parse(amenities) as unknown
    return Array.isArray(arr) ? arr.map(String) : []
  } catch {
    return []
  }
}
