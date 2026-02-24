const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('=== ฐานข้อมูล (SQLite) ===\n')

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  console.log('📌 User:', users.length, 'คน')
  users.forEach((u) => {
    console.log('   -', u.email, '|', u.name || '-', '| role:', u.role, '| สร้าง:', u.createdAt.toISOString())
  })

  const rooms = await prisma.room.findMany({
    select: { id: true, name: true, slug: true, pricePerNight: true, maxGuests: true },
    orderBy: { createdAt: 'asc' },
  })
  console.log('\n📌 Room:', rooms.length, 'ห้อง')
  rooms.forEach((r) => {
    console.log('   -', r.name, '| slug:', r.slug, '|', r.pricePerNight, 'บาท/คืน | สูงสุด', r.maxGuests, 'คน')
  })

  const bookings = await prisma.booking.findMany({
    select: { id: true, guestName: true, guestEmail: true, checkIn: true, checkOut: true, roomId: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  console.log('\n📌 Booking (ล่าสุด 10 รายการ):', bookings.length)
  bookings.forEach((b) => {
    console.log('   -', b.guestName, '|', b.guestEmail, '|', b.checkIn.toISOString().slice(0, 10), '-', b.checkOut.toISOString().slice(0, 10))
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
