'use client'

import { useEffect, useMemo, useState } from 'react'

export function HeroBackgroundSlideshow({
  images,
  intervalMs = 4500,
}: {
  images: string[]
  intervalMs?: number
}) {
  const slides = useMemo(() => images.filter(Boolean), [images])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [slides.length, intervalMs])

  return (
    <div className="absolute inset-0">
      {slides.length > 0 ? (
        slides.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url("${src}")` }}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600" />
      )}

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/40 to-black/55" />
    </div>
  )
}

