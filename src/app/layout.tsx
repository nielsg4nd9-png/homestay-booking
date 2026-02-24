import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { AuthProvider } from '@/components/AuthProvider'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'บ้านสวนโฮมสเตย์ | จองห้องพัก',
  description: 'ระบบจองห้องพักโฮมสเตย์ เลือกห้อง ตรวจสอบวันว่าง และจองออนไลน์',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  const showBackOffice = session && (role === 'ADMIN' || role === 'EMPLOYEE')

  return (
    <html lang="th">
      <body className={inter.className}>
        <AuthProvider>
        <header className="border-b bg-white/90 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
            <Link href="/" className="text-lg sm:text-xl font-semibold text-emerald-800 shrink-0">
              บ้านสวนโฮมสเตย์
            </Link>
            <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-4 text-xs sm:text-sm min-w-0">
              <Link href="/" className="text-gray-600 hover:text-emerald-700 py-1">
                หน้าหลัก
              </Link>
              {showBackOffice && (
                <Link href="/admin" className="text-gray-600 hover:text-emerald-700 py-1">
                  หลังบ้าน
                </Link>
              )}
              <Link href="/login" className="text-gray-600 hover:text-emerald-700 py-1">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-emerald-700 py-1">
                สมัครสมาชิก
              </Link>
            </nav>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="border-t bg-white py-4 sm:py-6 text-center text-gray-500 text-xs sm:text-sm px-3">
          ระบบจองห้องพักโฮมสเตย์ © {new Date().getFullYear()}
        </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
