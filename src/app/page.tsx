import Link from 'next/link'
import { Lock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatPrice, normalizeImageUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { RoomImage } from '@/components/RoomImage'
import { HeroBackgroundSlideshow } from '@/components/HeroBackgroundSlideshow'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const dynamic = 'force-dynamic'

type RoomItem = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  description: string | null
  pricePerNight: number
  maxGuests: number
}

type ProductItem = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  price: number | null
  unit: string | null
}

type NewsRoomItem = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  updatedAt: Date
}

type HeroSlideItem = {
  imageUrl: string
}

export default async function Home() {
  const prismaAny = prisma as any
  const [rooms, featuredProducts, latestRoomsForNews, heroSlides] = await Promise.all([
    prisma.room.findMany({ orderBy: { createdAt: 'asc' } }) as Promise<RoomItem[]>,
    prismaAny.serviceItem.findMany({
      where: { type: 'PRODUCT', isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 3,
    }) as Promise<ProductItem[]>,
    prisma.room.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 2,
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        updatedAt: true,
      },
    }) as Promise<NewsRoomItem[]>,
    prismaAny.heroSlide.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: { imageUrl: true },
      take: 8,
    }) as Promise<HeroSlideItem[]>,
  ])
  const heroSlideImagesFromRooms = rooms
    .map((room) => normalizeImageUrl(room.imageUrl))
    .filter((url): url is string => !!url && !/placehold\.co/i.test(url))
    .slice(0, 5)
  const heroSlideImagesFromAdmin = heroSlides
    .map((slide) => normalizeImageUrl(slide.imageUrl))
    .filter((url): url is string => !!url && !/placehold\.co/i.test(url))
  const heroSlideImages =
    heroSlideImagesFromAdmin.length > 0 ? heroSlideImagesFromAdmin : heroSlideImagesFromRooms

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border/40 bg-background">
        <HeroBackgroundSlideshow images={heroSlideImages} />
        <div className="relative z-10 container mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              กาแฟ บ้านสวน โฮมสเตย์
            </h1>
            <p className="mt-4 text-base text-white/90 sm:text-lg md:mt-6">
              BanSuan Homestay and Coffee บ้านสวนโฮมสเตย์ บริการที่พักโฮมสเตย์ คาเฟ่แนวธรรมชาติ <br/>ผลิตและจำหน่ายกาแฟอาราบิก้า100% ​(Bio.) ​กาแฟที่​ปลอดภัย​ปลอด​สาร​เคมีดีต่อสุขภาพ
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-white">Homestay</span>
              <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-white">Coffee</span>
              <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-white">Ban La-oop</span>
              <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-white">Mae La Noi</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">สินค้าแนะนำ</h2>
              <p className="mt-1 text-sm text-muted-foreground">สินค้าเด่นจากโฮมสเตย์และคาเฟ่</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/services">ดูสินค้าทั้งหมด</Link>
            </Button>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-[4/3] bg-muted">
                    <RoomImage
                      imageUrl={item.imageUrl}
                      roomName={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>สินค้าแนะนำ</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {item.description || 'สินค้าจากบ้านสวนโฮมสเตย์และคาเฟ่'}
                    </p>
                    {item.price != null && (
                      <p className="mt-2 font-medium text-emerald-600">
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
                ยังไม่มีสินค้าแนะนำในขณะนี้
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">ข่าวสารโฮมสเตย์</h2>
              <p className="mt-1 text-sm text-muted-foreground">อัปเดตบรรยากาศและข้อมูลล่าสุดจากที่พัก</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="https://www.facebook.com/bansuanhomestayandcoffee" target="_blank" rel="noreferrer">
                ติดตามข่าวจากเพจ
              </a>
            </Button>
          </div>
          {latestRoomsForNews.length > 0 ? (
            <div className="space-y-6">
              {latestRoomsForNews.map((room, index) => (
                <Link key={room.id} href={`/rooms/${room.slug}`} className="group">
                  <Card className="overflow-hidden border-slate-300/90 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <div
                      className={`flex flex-col ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div className="md:w-[280px] md:shrink-0 bg-muted">
                        <div className="h-52 md:h-full">
                          <RoomImage
                            imageUrl={room.imageUrl}
                            roomName={room.name}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <div className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-500">
                          <Lock className="h-4 w-4" />
                          ข่าวสารโฮมสเตย์
                        </div>
                        <h3 className="line-clamp-2 text-2xl font-bold text-slate-900 transition group-hover:text-emerald-700">
                          อัปเดตห้องพัก: {room.name}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-slate-600 sm:text-lg">
                          บรรยากาศล่าสุดของห้องพักและพื้นที่โดยรอบ พร้อมข้อมูลการเข้าพักที่อัปเดตเพื่อให้คุณวางแผนทริปได้ง่ายขึ้น
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                            BS
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Ban Suan Homestay</p>
                            <p className="text-sm text-slate-500">
                              {new Date(room.updatedAt).toLocaleDateString('th-TH', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                ยังไม่มีข่าวสารในขณะนี้
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">ห้องพักทั้งหมด</h2>
          <p className="mt-1 text-sm text-muted-foreground">เลือกห้องที่ต้องการ แล้วจองออนไลน์ได้ทันที</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link key={room.id} href={`/rooms/${room.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-[4/3] shrink-0 overflow-hidden bg-muted">
                  <RoomImage
                    imageUrl={room.imageUrl}
                    roomName={room.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-emerald-700">
                    {room.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {room.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-base font-medium text-emerald-600">
                    {formatPrice(room.pricePerNight)}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">/ คืน</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">สูงสุด {room.maxGuests} คน</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full pointer-events-none">
                    ดูรายละเอียด
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {rooms.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground sm:py-20">
              ยังไม่มีห้องพัก —{' '}
              <Button variant="link" asChild className="mt-2 p-0 text-emerald-600">
                <Link href="/admin/rooms">จัดการห้อง</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <a href="https://www.facebook.com/bansuanhomestayandcoffee" target="_blank" rel="noreferrer">
              ดูข้อมูลล่าสุดจากเพจ Facebook
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">เกี่ยวกับเรา</Link>
          </Button>
        </div>

        <div className="mt-8">
          <Card className="border-emerald-200/80 bg-emerald-50/40">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-900">บริการคาเฟ่และเครื่องดื่ม</CardTitle>
              <CardDescription className="text-emerald-800/90">
                Ban Suan Homestay and Coffee
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-emerald-900 sm:text-base">
              <p>
                มีบริการในคอนเซ็ปต์โฮมสเตย์และคาเฟ่ โดยรายการเมนูและเวลาบริการ 07:00-18:00
              </p>
              <div>
                <Button asChild variant="outline" className="border-emerald-300 text-emerald-800 hover:bg-emerald-100">
                  <Link href="/services">ดูเมนูทั้งหมด</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
