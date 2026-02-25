const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const rooms = await prisma.room.findMany({
    select: {
      name: true,
      slug: true,
      imageUrl: true,
    },
    orderBy: { createdAt: 'asc' },
  })
  console.log(JSON.stringify(rooms, null, 2))
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })

