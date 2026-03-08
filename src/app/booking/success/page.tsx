import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
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

export const dynamic = 'force-dynamic'

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role ?? 'USER'
  const bookingHref = role === 'ADMIN' || role === 'EMPLOYEE' ? '/admin/bookings' : '/booking/check'
  const bookingButtonLabel = role === 'ADMIN' || role === 'EMPLOYEE' ? 'ไปหน้ารายการจองหลังบ้าน' : 'เช็คข้อมูลการจอง'
  const bookingId = searchParams.id?.trim()
  let totalPrice: number | null = null

  if (bookingId) {
    const booking =
      role === 'ADMIN' || role === 'EMPLOYEE'
        ? await prisma.booking.findUnique({
            where: { id: bookingId },
            select: { totalPrice: true },
          })
        : await prisma.booking.findFirst({
            where: { id: bookingId, guestEmail: session?.user?.email ?? '' },
            select: { totalPrice: true },
          })

    totalPrice = booking?.totalPrice ?? null
  }
  const depositAmount = totalPrice != null ? Math.round(totalPrice * 0.5) : null
  const remainingAmount =
    totalPrice != null && depositAmount != null ? totalPrice - depositAmount : null

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <span className="text-3xl text-emerald-600">✓</span>
          </div>
          <CardTitle className="text-xl">จองสำเร็จ</CardTitle>
          <CardDescription>
            เราได้บันทึกคำจองของคุณแล้ว จะติดต่อยืนยันผ่านอีเมล
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookingId && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-center">
              <p className="text-xs text-muted-foreground">รหัสการจอง (เก็บไว้เพื่อเช็คข้อมูล)</p>
              <p className="mt-1 font-mono text-sm font-medium break-all">{bookingId}</p>
            </div>
          )}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-medium">ขั้นตอนการชำระค่าบริการ</p>
            {totalPrice != null && depositAmount != null && remainingAmount != null ? (
              <>
                <p className="mt-1">ยอดรวมค่าบริการ: {formatPrice(totalPrice)}</p>
                <p>ค่ามัดจำ 50% (ชำระหลังจอง): {formatPrice(depositAmount)}</p>
                <p>ยอดคงเหลือ 50%: {formatPrice(remainingAmount)}</p>
              </>
            ) : (
              <>
                <p className="mt-1">- ชำระค่ามัดจำ 50% หลังจากทำการจอง</p>
                <p>- ชำระค่าบริการส่วนที่เหลือ 50% ตามกำหนดของที่พัก</p>
                <p className="mt-1 text-xs text-amber-800">
                  ตัวอย่างยอดรวม 2,000 บาท: มัดจำ 1,000 บาท / คงเหลือ 1,000 บาท
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/">กลับหน้าหลัก</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={bookingHref}>{bookingButtonLabel}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
