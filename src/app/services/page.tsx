import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RoomImage } from '@/components/RoomImage'
import { formatPrice } from '@/lib/utils'

export const metadata = {
  title: 'สินค้าและบริการ | บ้านสวนโฮมสเตย์',
  description:
    'รวมสินค้าและบริการของ กาแฟ บ้านสวน โฮมสเตย์ Ban Suan Homestay and Coffee (Mae La Noi)',
}

export default async function ServicesPage() {
  const [rooms, serviceItems] = await Promise.all([
    prisma.room.findMany({
      orderBy: { createdAt: 'asc' },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        description: true,
        pricePerNight: true,
        maxGuests: true,
      },
    }),
    prisma.serviceItem.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 24,
    }),
  ])

  const products = serviceItems.filter((item) => item.type === 'PRODUCT')
  const services = serviceItems.filter((item) => item.type !== 'PRODUCT')

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
      <section className="rounded-2xl border border-border/60 bg-background p-6 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          สินค้าและบริการ
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          บริการหลักของที่พักประกอบด้วยโฮมสเตย์และบริการที่เกี่ยวข้อง รวมถึงคอนเซ็ปต์ร้านกาแฟ
          Ban Suan Homestay and Coffee ในพื้นที่ Mae La Noi
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
            <CardTitle>ที่พักโฮมสเตย์</CardTitle>
            <CardDescription>ห้องพักหลายรูปแบบ</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            เลือกประเภทห้องที่เหมาะกับจำนวนผู้เข้าพักและงบประมาณ พร้อมจองออนไลน์ได้ทันที
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>คาเฟ่และเครื่องดื่ม</CardTitle>
            <CardDescription>Ban Suan Homestay and Coffee</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            มีบริการในคอนเซ็ปต์โฮมสเตย์และคาเฟ่ โดยรายการเมนูและเวลาบริการแนะนำให้ตรวจสอบจากเพจโดยตรง
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>สอบถามเพิ่มเติม</CardTitle>
            <CardDescription>อัปเดตจากเพจล่าสุด</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            ราคา โปรโมชั่น และข้อมูลบริการอื่นๆ อาจมีการอัปเดตตามช่วงเวลา สามารถติดต่อผ่านเพจได้โดยตรง
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">สินค้าที่มีจำหน่าย</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((item) => (
              <Card key={item.id}>
                <div className="aspect-[4/3] bg-muted overflow-hidden rounded-t-xl">
                  <RoomImage
                    imageUrl={item.imageUrl}
                    roomName={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>สินค้า</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{item.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                  {item.price != null && (
                    <p className="font-medium text-emerald-600">
                      {formatPrice(item.price)}
                      {item.unit ? ` / ${item.unit}` : ''}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              ยังไม่มีสินค้าที่แสดงผล
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">ห้องพักที่ให้บริการ</h2>
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Link
                key={room.id}
                href={`/rooms/${room.slug}`}
                className="group overflow-hidden rounded-xl border border-border/60 bg-background hover:shadow-md transition"
              >
                <div className="aspect-[4/3] bg-muted">
                  <RoomImage
                    imageUrl={room.imageUrl}
                    roomName={room.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-emerald-700">
                    {room.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {room.description}
                  </p>
                  <p className="mt-2 text-emerald-600 font-medium">
                    {formatPrice(room.pricePerNight)}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">/ คืน</span>
                  </p>
                  <p className="text-sm text-muted-foreground">สูงสุด {room.maxGuests} คน</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">
              ยังไม่มีข้อมูลห้องพักในระบบ
            </CardContent>
          </Card>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">บริการอื่นๆ</h2>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>บริการ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{item.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                  {item.price != null && (
                    <p className="font-medium text-emerald-600">
                      {formatPrice(item.price)}
                      {item.unit ? ` / ${item.unit}` : ''}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-emerald-200/70 bg-emerald-50/40">
            <CardHeader>
              <CardTitle>รายละเอียดบริการและเมนูทั้งหมด</CardTitle>
              <CardDescription>
                Ban Suan Homestay and Coffee (เวลาให้บริการคาเฟ่ 07:00-18:00)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-emerald-950">
              <p>
                มีบริการในคอนเซ็ปต์โฮมสเตย์และคาเฟ่แนวธรรมชาติ พร้อมเมนูเครื่องดื่มและอาหารว่าง
                โดยเมนูอาจปรับตามฤดูกาลและวัตถุดิบในแต่ละวัน
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-emerald-200 bg-white p-3">
                  <p className="font-semibold text-emerald-900">เมนูเครื่องดื่มกาแฟ</p>
                  <ul className="mt-2 space-y-1 text-emerald-900/90">
                    <li>- อเมริกาโน่ร้อน / เย็น</li>
                    <li>- ลาเต้ร้อน / เย็น</li>
                    <li>- คาปูชิโน่</li>
                    <li>- มอคค่า</li>
                    <li>- เอสเปรสโซ่</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-white p-3">
                  <p className="font-semibold text-emerald-900">เมนูไม่ใช่กาแฟ</p>
                  <ul className="mt-2 space-y-1 text-emerald-900/90">
                    <li>- ชาไทย / ชาเขียว</li>
                    <li>- โกโก้</li>
                    <li>- นมสด / นมชมพู</li>
                    <li>- ชามะนาว / น้ำผลไม้</li>
                    <li>- โซดาผลไม้</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-white p-3 md:col-span-2">
                  <p className="font-semibold text-emerald-900">อาหารว่างและบริการอื่นๆ</p>
                  <ul className="mt-2 space-y-1 text-emerald-900/90">
                    <li>- ขนมปังปิ้ง / เค้กประจำวัน</li>
                    <li>- ชุดอาหารเช้า (ตามแพ็กเกจที่พัก)</li>
                    <li>- มุมนั่งพักผ่อนและถ่ายภาพ</li>
                    <li>- บริการข้อมูลท่องเที่ยวในพื้นที่บ้านละอูบและใกล้เคียง</li>
                  </ul>
                </div>
              </div>

              <p className="text-xs text-emerald-800/90">
                หมายเหตุ: รายการเมนูและราคาอาจมีการเปลี่ยนแปลงตามประกาศล่าสุดของทางที่พัก
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">การชำระค่าบริการ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>1) ค่ามัดจำ</CardTitle>
              <CardDescription>ชำระหลังจากทำการจอง</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                ค่ามัดจำคิดเป็น <span className="font-semibold text-foreground">50%</span>{' '}
                ของค่าบริการทั้งหมด
              </p>
              <p>กรุณาชำระค่ามัดจำหลังจากยืนยันการจอง เพื่อยืนยันสิทธิ์การจองของท่าน</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2) ค่าบริการทั้งหมด</CardTitle>
              <CardDescription>ชำระส่วนที่เหลือจากค่ามัดจำ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                ค่าบริการทั้งหมดส่วนที่เหลือ คือ <span className="font-semibold text-foreground">50%</span>{' '}
                หลังหักค่ามัดจำแล้ว
              </p>
              <p>ช่องทางและกำหนดการชำระส่วนที่เหลือ สามารถติดต่อสอบถามเพิ่มเติมกับที่พักได้โดยตรง</p>
            </CardContent>
          </Card>
        </div>
        <Card className="border-emerald-100 bg-emerald-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">ตัวอย่างการคำนวณ</CardTitle>
            <CardDescription>เพื่อความเข้าใจง่ายก่อนทำรายการจอง</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-emerald-900 space-y-1">
            <p>ยอดรวมค่าบริการทั้งหมด 2,000 บาท</p>
            <p>
              ค่ามัดจำ 50% = <span className="font-semibold">1,000 บาท</span>
            </p>
            <p>
              ค่าบริการส่วนที่เหลือ = <span className="font-semibold">1,000 บาท</span>
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-2xl border border-border/60 bg-background p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground">ดูข้อมูลล่าสุดจากเพจ</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          รายการสินค้า/บริการจริง รายละเอียดเมนู และเวลาให้บริการล่าสุด อ้างอิงจากเพจ Facebook
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <a href="https://www.facebook.com/bansuanhomestayandcoffee" target="_blank" rel="noreferrer">
              ไปยังเพจ Facebook
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">กลับหน้าหลัก</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

