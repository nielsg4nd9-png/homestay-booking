const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const tables = await prisma.$queryRawUnsafe(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
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
