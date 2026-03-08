import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RoomImage } from '@/components/RoomImage'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'เกี่ยวกับเรา | บ้านสวนโฮมสเตย์',
  description: 'ข้อมูลเกี่ยวกับ กาแฟ บ้านสวน โฮมสเตย์ Ban Suan Homestay and Coffee (Mae La Noi)',
}

export default async function AboutPage() {
  const galleryRooms = await prisma.room.findMany({
    select: {
      name: true,
      slug: true,
      imageUrl: true,
    },
    orderBy: { createdAt: 'asc' },
    take: 3,
  })

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
      <section className="rounded-2xl border border-border/60 bg-background p-6 sm:p-10">
        <p className="text-sm font-medium text-emerald-700 mb-2">Ban Suan Homestay and Coffee</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          บ้านสวนโฮมสเตย์
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          โฮมสเตย์และร้านกาแฟในบรรยากาศธรรมชาติ เหมาะสำหรับการพักผ่อนแบบเรียบง่าย
          และใช้เวลาอย่างช้าๆ ในพื้นที่แม่ลาน้อย
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">โฮมสเตย์</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">ร้านกาแฟ</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Mae La Noi</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>จุดเด่น</CardTitle>
            <CardDescription>แนวทางการพักผ่อน</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            บรรยากาศสงบ ใกล้ธรรมชาติ เหมาะกับคู่รัก ครอบครัว หรือกลุ่มเพื่อนที่ต้องการพักผ่อนแบบเรียบง่าย
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ที่ตั้ง</CardTitle>
            <CardDescription>พื้นที่บริการ</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Mae La Noi
            <br />
            (ดูพิกัดล่าสุด/การเดินทางในเพจ Facebook)
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ช่องทางอัปเดต</CardTitle>
            <CardDescription>ข้อมูลล่าสุดจากเพจ</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            รายละเอียดห้องพัก ราคา โปรโมชั่น และช่วงเวลาเปิดบริการ อัปเดตผ่าน Facebook Page เป็นหลัก
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>บรรยากาศที่พัก</CardTitle>
          <CardDescription>ภาพประกอบจากห้องพักในระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          {galleryRooms.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryRooms.map((room) => (
                <Link
                  key={room.slug}
                  href={`/rooms/${room.slug}`}
                  className="group overflow-hidden rounded-xl border border-border/60"
                >
                  <div className="aspect-[4/3] bg-muted">
                    <RoomImage
                      imageUrl={room.imageUrl}
                      roomName={room.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="border-t border-border/60 bg-background px-3 py-2 text-sm font-medium text-foreground">
                    {room.name}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
              ยังไม่มีรูปห้องพักในระบบ
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>คำถามที่พบบ่อย (FAQ)</CardTitle>
          <CardDescription>ข้อมูลเบื้องต้นก่อนจอง</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <details className="rounded-lg border border-border/60 px-3 py-2">
            <summary className="cursor-pointer font-medium text-foreground">จองผ่านช่องทางไหนได้บ้าง?</summary>
            <p className="pt-2">
              สามารถจองผ่านเว็บไซต์นี้ได้ทันที หรือสอบถามรายละเอียดเพิ่มเติมผ่านเพจ Facebook
            </p>
          </details>
          <details className="rounded-lg border border-border/60 px-3 py-2">
            <summary className="cursor-pointer font-medium text-foreground">มีร้านกาแฟในพื้นที่เดียวกันไหม?</summary>
            <p className="pt-2">
              มีบริการในคอนเซ็ปต์ Ban Suan Homestay and Coffee โดยรายละเอียดเมนู/เวลาเปิดสามารถดูจากเพจได้
            </p>
          </details>
          <details className="rounded-lg border border-border/60 px-3 py-2">
            <summary className="cursor-pointer font-medium text-foreground">อัปเดตข้อมูลล่าสุดได้จากที่ไหน?</summary>
            <p className="pt-2">
              แนะนำติดตามประกาศล่าสุดผ่าน Facebook Page โดยตรง เพื่อดูข้อมูลที่อัปเดตก่อนเข้าพัก
            </p>
          </details>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ติดต่อเรา</CardTitle>
          <CardDescription>อ้างอิงจากเพจ Facebook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Facebook Page:{' '}
            <a
              href="https://www.facebook.com/bansuanhomestayandcoffee"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-700 underline underline-offset-4 hover:text-emerald-800"
            >
              กาแฟ บ้านสวน โฮมสเตย์ Ban Suan Homestay and Coffee
            </a>
          </p>
          <p>หมายเหตุ: รายละเอียดบริการ/ราคา/เวลาทำการ อาจมีการเปลี่ยนแปลงตามประกาศล่าสุดของเพจ</p>
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <a
                href="https://www.facebook.com/bansuanhomestayandcoffee"
                target="_blank"
                rel="noreferrer"
              >
                ไปยังเพจ Facebook
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">กลับหน้าหลัก</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

