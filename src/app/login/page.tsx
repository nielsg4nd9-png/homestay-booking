'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">เข้าสู่ระบบ</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          ยังไม่มีบัญชี? <Link href="/register" className="text-emerald-600 hover:underline">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  )
}

