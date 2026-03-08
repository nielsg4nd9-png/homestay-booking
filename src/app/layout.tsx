import type { Metadata } from 'next'
import { Prompt } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { AuthProvider } from '@/components/AuthProvider'
import { SiteHeader } from '@/components/SiteHeader'
import { authOptions } from '@/lib/auth-options'
import './globals.css'

const prompt = Prompt({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'บ้านสวนโฮมสเตย์ | จองห้องพัก',
  description: 'ระบบจองห้องพักโฮมสเตย์ เลือกห้อง ตรวจสอบวันว่าง และจองออนไลน์',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (_) {
    // NEXTAUTH_SECRET/NEXTAUTH_URL missing or DB error — แสดงหน้าได้แต่ไม่มี session
  }
  const role = (session?.user as { role?: string })?.role
  const showBackOffice = session && (role === 'ADMIN' || role === 'EMPLOYEE')
  const headerUser = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        role: role ?? 'USER',
      }
    : null

  return (
    <html lang="th" className={prompt.variable}>
      <body className="min-h-screen font-sans antialiased">
        <AuthProvider>
        <SiteHeader showBackOffice={!!showBackOffice} user={headerUser} />
        <main className="min-h-screen bg-muted/50">
          {children}
        </main>
        <footer className="border-t border-gray-200 bg-white">
          <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-500 sm:flex-row">
              <p>ระบบจองห้องพักโฮมสเตย์ © {new Date().getFullYear()}</p>
            </div>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
