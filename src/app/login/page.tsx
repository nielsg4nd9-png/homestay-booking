import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4 text-center">
          <div className="h-8 w-48 animate-pulse rounded bg-muted mx-auto" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  )
}
