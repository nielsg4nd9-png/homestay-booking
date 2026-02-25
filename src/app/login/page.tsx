'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: (searchParams.get('callbackUrl') as string) || '/',
    })
    setLoading(false)
    if (!res) {
      setError('ไม่สามารถเข้าสู่ระบบได้')
      return
    }
    if (res.error) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      return
    }
    router.push(res.url || '/')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
          <CardDescription>กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                อีเมล
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                รหัสผ่าน
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="h-10 w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{' '}
            <Link href="/register" className="font-medium text-emerald-600 underline hover:text-emerald-700">
              สมัครสมาชิก
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
