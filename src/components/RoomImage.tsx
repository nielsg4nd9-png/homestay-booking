'use client'

import { useEffect, useState } from 'react'
import { normalizeImageUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function RoomImage({
  imageUrl,
  roomName,
  className,
}: {
  imageUrl?: string | null
  roomName: string
  className: string
}) {
  const normalized = normalizeImageUrl(imageUrl)
  const [hasError, setHasError] = useState(false)
  const isExternalPlaceholder = normalized ? /placehold\.co/i.test(normalized) : false

  useEffect(() => {
    setHasError(false)
  }, [normalized])

  if (!normalized || hasError || isExternalPlaceholder) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-emerald-50 px-4 text-center',
          className
        )}
      >
        <span className="line-clamp-2 text-sm font-medium text-emerald-700">
          ไม่มีรูปภาพ
        </span>
      </div>
    )
  }

  return (
    <img
      src={normalized}
      alt={roomName}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}

