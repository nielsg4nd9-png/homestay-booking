import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login?callbackUrl=/profile')
  }

  const role = (session.user as { role?: string })?.role ?? 'USER'
  const bookingHref = role === 'ADMIN' || role === 'EMPLOYEE' ? '/admin/bookings' : '/booking/check'
  const roleLabel =
    role === 'ADMIN' ? 'ADMIN (แอดมิน)'
    : role === 'EMPLOYEE' ? 'EMPLOYEE (พนักงาน)'
    : 'USER (ผู้ใช้งาน)'

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Card>
        <CardHeader>
          <CardTitle>โปรไฟล์ผู้ใช้</CardTitle>
          <CardDescription>ข้อมูลบัญชีที่กำลังล็อกอิน</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">ชื่อ</p>
            <p className="font-medium">{session.user.name || '-'}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">อีเมล</p>
            <p className="font-medium break-all">{session.user.email}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">สิทธิ์การใช้งาน</p>
            <p className="font-medium">{roleLabel}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button asChild variant="outline" className="w-full">
              <Link href={bookingHref}>เช็คการจอง</Link>
            </Button>
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/">กลับหน้าหลัก</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

