const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const tables = await prisma.$queryRawUnsafe(
    "SELECT tablename AS name FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
  )
  console.log('ตารางในฐานข้อมูล:', tables.map((t) => t.name).join(', '))
  const count = await prisma.user.count()
  console.log('จำนวนแถวใน User:', count)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
