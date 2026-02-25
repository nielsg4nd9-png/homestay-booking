import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AdminPageContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('w-full max-w-none p-4 sm:p-6 md:p-8', className)}>{children}</div>
}

export function AdminPageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3', className)}>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

export function AdminTableCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden', className)}>
      {children}
    </div>
  )
}

