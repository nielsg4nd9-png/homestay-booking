import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { DepositSlipUploader } from './DepositSlipUploader'
 
export default async function BookingCheckPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/booking/check')
  }
  const role = (session.user as { role?: string })?.role ?? 'USER'
  if (role === 'ADMIN' || role === 'EMPLOYEE') {
    redirect('/admin/bookings')
  }

  const bookings = await prisma.booking.findMany({
    where: {
      guestEmail: session.user.email,
    },
    include: {
      room: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">เช็คข้อมูลการจอง</h1>
        <p className="mt-1 text-muted-foreground">แสดงรายการจองของบัญชีที่คุณล็อกอินอยู่</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ข้อมูลผู้ใช้งาน</CardTitle>
          <CardDescription>
            บัญชีนี้: {session.user.name || '-'} ({session.user.email})
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              ยังไม่พบรายการจองของบัญชีนี้
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  <div>
                    <CardTitle>ข้อมูลการจอง</CardTitle>
                    <CardDescription>รหัส {booking.id}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">ห้องพัก</span>
                    <Link
                      href={`/rooms/${booking.room.slug}`}
                      className="font-medium text-emerald-600 hover:underline"
                    >
                      {booking.room.name}
                    </Link>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">ผู้จอง</span>
                    <span className="font-medium">{booking.guestName}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">อีเมล</span>
                    <span>{booking.guestEmail}</span>
                  </div>
                  {booking.guestPhone && (
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">เบอร์โทร</span>
                      <span>{booking.guestPhone}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">วันเช็คอิน</span>
                    <span>
                      {new Date(booking.checkIn).toLocaleDateString('th-TH', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">วันเช็คเอาท์</span>
                    <span>
                      {new Date(booking.checkOut).toLocaleDateString('th-TH', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">จำนวนผู้เข้าพัก</span>
                    <span>{booking.guests} คน</span>
                  </div>
                  {booking.totalPrice != null && (
                    <>
                      <div className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">ยอดรวม</span>
                        <span className="font-semibold text-foreground">
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">ค่ามัดจำ (50%)</span>
                        <span>{formatPrice(Math.round(booking.totalPrice * 0.5))}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">ยอดคงเหลือ</span>
                        <span>
                          {formatPrice(booking.totalPrice - Math.round(booking.totalPrice * 0.5))}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">สถานะค่ามัดจำ</span>
                        <span
                          className={`font-medium ${
                            booking.depositPaid ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {booking.depositPaid ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
                        </span>
                      </div>
                      {booking.depositPaidAt && (
                        <div className="flex justify-between border-b border-border/50 pb-2">
                          <span className="text-muted-foreground">วันที่ชำระมัดจำ</span>
                          <span>{new Date(booking.depositPaidAt).toLocaleString('th-TH')}</span>
                        </div>
                      )}
                      {booking.depositVerificationStatus === 'SUBMITTED' && (
                        <>
                          <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">สถานะตรวจสลิป</span>
                            <span className="font-medium text-blue-700">รอแอดมินตรวจสอบ</span>
                          </div>
                          {booking.depositSlipUrl && (
                            <div className="flex justify-between border-b border-border/50 pb-2">
                              <span className="text-muted-foreground">สลิปที่ส่ง</span>
                              <a
                                href={booking.depositSlipUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-blue-700 hover:underline"
                              >
                                ดูสลิป
                              </a>
                            </div>
                          )}
                        </>
                      )}
                      {booking.depositVerificationStatus === 'REJECTED' && (
                        <>
                          <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">สถานะตรวจสลิป</span>
                            <span className="font-medium text-red-700">ถูกปฏิเสธ</span>
                          </div>
                          {booking.depositReviewNote && (
                            <div className="rounded-md border border-red-100 bg-red-50 p-2 text-xs text-red-700">
                              หมายเหตุจากแอดมิน: {booking.depositReviewNote}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  <div className="flex justify-between pt-1 text-muted-foreground">
                    <span>จองเมื่อ</span>
                    <span>{new Date(booking.createdAt).toLocaleString('th-TH')}</span>
                  </div>
                </div>
                {!booking.depositPaid && booking.depositVerificationStatus !== 'SUBMITTED' && (
                  <DepositSlipUploader
                    bookingId={booking.id}
                    depositAmount={booking.totalPrice != null ? Math.round(booking.totalPrice * 0.5) : null}
                  />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="underline hover:text-foreground">
          กลับหน้าหลัก
        </Link>
      </p>
    </div>
  )
}
