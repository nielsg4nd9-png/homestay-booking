import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();

  await prisma.room.createMany({
    data: [
      {
        name: 'ห้องนอนใหญ่ 1',
        slug: 'large-bedroom-1',
        description: 'ห้องนอนใหญ่ เตียงคู่ พื้นที่กว้าง เหมาะสำหรับคู่รักหรือครอบครัวเล็ก',
        pricePerNight: 1500,
        maxGuests: 3,
        imageUrl: 'https://placehold.co/800x600/e8f5e9/2e7d32?text=ห้องนอนใหญ่+1',
        amenities: '["WiFi","แอร์","ทีวี","ที่จอดรถ"]',
      },
      {
        name: 'ห้องนอนใหญ่ 2',
        slug: 'large-bedroom-2',
        description: 'ห้องนอนใหญ่ เตียงคู่ ขนาดและสิ่งอำนวยความสะดวกใกล้เคียงกับห้องนอนใหญ่ 1',
        pricePerNight: 1500,
        maxGuests: 3,
        imageUrl: 'https://placehold.co/800x600/e8f5e9/2e7d32?text=ห้องนอนใหญ่+2',
        amenities: '["WiFi","แอร์","ทีวี","ที่จอดรถ"]',
      },
      {
        name: 'บ้านเดี่ยว',
        slug: 'private-house',
        description: 'บ้านเดี่ยวทั้งหลัง เป็นส่วนตัว มีพื้นที่นั่งเล่นและระเบียง เหมาะสำหรับครอบครัวหรือกลุ่มเพื่อน',
        pricePerNight: 2800,
        maxGuests: 6,
        imageUrl: 'https://placehold.co/800x600/e8f5e9/2e7d32?text=บ้านเดี่ยว',
        amenities: '["WiFi","แอร์","ทีวี","ตู้เย็น","ห้องครัวเล็ก","ที่จอดรถ"]',
      },
      {
        name: 'ลานกางเต็นท์',
        slug: 'camping-field',
        description: 'ลานกางเต็นท์บรรยากาศธรรมชาติ มีบริการเช่าเต็นท์และอุปกรณ์พักแรมพื้นฐาน',
        pricePerNight: 300,
        maxGuests: 10,
        imageUrl: 'https://placehold.co/800x600/e8f5e9/2e7d32?text=ลานกางเต็นท์',
        amenities: '["บริการเช่าเต็นท์","จุดต่อไฟ","ห้องน้ำรวม","ที่จอดรถ"]',
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
