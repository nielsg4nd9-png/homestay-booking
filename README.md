# ระบบจองห้องพักโฮมสเตย์

เว็บแอป Next.js + Prisma (PostgreSQL) สำหรับจองห้องพักโฮมสเตย์

## สิ่งที่มีในระบบ

- **หน้าหลัก** — แสดงรายการห้องพัก
- **หน้ารายละเอียดห้อง** — ดูข้อมูลห้อง + ฟอร์มจอง (เช็คอิน/เช็คเอาท์, ชื่อ, อีเมล, โทร)
- **ตรวจวันซ้อน** — ไม่ให้จองช่วงวันที่ชนกับรายการเดิม
- **หลังจองสำเร็จ** — ไปหน้า success แสดงรหัสการจอง
- **แอดมิน** — เพิ่ม/แก้ไข/ลบห้อง (`/admin/rooms`)

## วิธีรัน

```bash
cd D:\homestay-booking
npm run dev
```

เปิดเบราว์เซอร์ที่ **http://localhost:3000** (หรือ 3001 ถ้าพอร์ต 3000 ถูกใช้)

## ฐานข้อมูล

- ใช้ PostgreSQL (รองรับ Vercel, Neon, Supabase, Docker)
- ตั้งค่า `DATABASE_URL` ใน `.env` ตาม `.env.example`
- สร้างตาราง: `npm run db:push`
- ใส่ข้อมูลตัวอย่าง: `npm run db:seed`

## การ Deploy

- **Vercel:** ดู [docs/DEPLOY-VERCEL.md](docs/DEPLOY-VERCEL.md) (ตั้งค่า Postgres + Vercel Blob)
- **รันด้วย Node:** `npm run build` แล้ว `npm run start` (ตั้งค่า env ตาม `.env.example`)
- **รันด้วย Docker:** ดู [docs/DEPLOY.md](docs/DEPLOY.md) — รัน `npm run docker:build` แล้ว `npm run docker:up` (มี Postgres ใน compose)

## ขั้นตอนถัดไป (ถ้าต้องการ)

1. **อัปเกรด Node** เป็น 20+ แล้วค่อยอัป Prisma/Next เป็นรุ่นล่าสุด (ตอนนี้ใช้ Node 18 จึงใช้ Next 13 + Prisma 5)
2. **ล็อกอินแอดมิน** — เพิ่ม auth (เช่น NextAuth) แล้วป้องกัน `/admin` และ `/api/admin`
3. **อีเมลยืนยัน** — ส่งอีเมลหลังจอง (Resend, Nodemailer ฯลฯ)
4. **อัปโหลดรูป** — เก็บรูปห้องใน storage (เช่น S3, Cloudinary) แทน URL อย่างเดียว
