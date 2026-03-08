# คู่มือ Deploy ระบบจองห้องพักโฮมสเตย์

## 1. เตรียมตัวแปรสภาพแวดล้อม

คัดลอกไฟล์ตัวอย่างแล้วแก้ค่าให้ตรงกับเซิร์ฟเวอร์:

```bash
cp .env.example .env
```

แก้ไข `.env` โดยเฉพาะ:

| ตัวแปร | คำอธิบาย |
|--------|----------|
| `DATABASE_URL` | PostgreSQL connection string (ดู `.env.example`) |
| `NEXTAUTH_URL` | URL หลักของเว็บ เช่น `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | สร้างด้วย `openssl rand -base64 32` |

ตัวแปร `NEXT_PUBLIC_PAYMENT_*` เป็นตัวเลือก สำหรับแสดงข้อมูลบัญชีรับโอนในหน้าจอง

**Deploy บน Vercel:** ดู [docs/DEPLOY-VERCEL.md](DEPLOY-VERCEL.md)

โปรเจกต์ใช้ **PostgreSQL เท่านั้น** — local ใส่ `DATABASE_URL="postgresql://..."` ใน `.env` (Neon / Docker postgres) แล้วรัน `npm run db:push` และ `npm run dev` ตามปกติ

---

## 2. Deploy แบบรันด้วย Node (ไม่ใช้ Docker)

เหมาะกับ VPS / shared hosting ที่มี Node.js 20+

```bash
# ติดตั้ง dependencies
npm ci

# สร้างตารางและ seed (ครั้งแรกเท่านั้น)
npx prisma generate
npx prisma db push
npm run db:seed   # ถ้าต้องการข้อมูลตัวอย่าง

# Build และรัน
npm run build
npm run start
```

แอปจะรันที่พอร์ต 3000 (หรือตาม `PORT` ใน env)

---

## 3. Deploy ด้วย Docker

### Build และรันด้วย Docker Compose

```bash
# สร้าง .env จาก .env.example และใส่ NEXTAUTH_SECRET
cp .env.example .env
# แก้ NEXTAUTH_URL เป็น URL จริง เช่น https://yourdomain.com

# Build และรัน
docker compose up -d --build
```

เปิดเว็บที่ `http://localhost:3000` (หรือพอร์ตที่ map ไว้)

- ครั้งแรกที่ volume ว่าง container จะรัน `prisma db push` ให้เอง
- ข้อมูล DB อยู่ใน volume `app-db` รูปอัปโหลดอยู่ใน `app-uploads`

### รัน seed หลัง deploy (ข้อมูลตัวอย่าง)

```bash
docker compose run --rm app npx prisma db seed
```

ถ้า seed ใช้ `ts-node` อาจต้องรันจาก host แทน:

```bash
npm run db:seed
# แล้วค่อย copy ไฟล์ prisma/dev.db เข้า volume หรือ mount โฟลเดอร์ prisma
```

### Build image เดี่ยว (ไม่ใช้ docker-compose)

```bash
docker build -t homestay-booking .
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e DATABASE_URL=postgresql://homestay:homestay@host.docker.internal:5432/homestay \
  -v homestay-uploads:/app/public/uploads \
  homestay-booking
```

---

## 4. หมายเหตุสำคัญ

- **NEXTAUTH_URL** ต้องตรงกับ URL ที่ผู้ใช้เข้า (รวม https ถ้าใช้ SSL)
- โปรเจกต์ใช้ **PostgreSQL** (รองรับ Vercel และ Docker)
- ไฟล์อัปโหลดและ DB ควรอยู่บน volume หรือ path ที่ไม่หายเมื่อ restart container
- สำหรับ production ควรใช้ reverse proxy (เช่น Nginx, Caddy) ทำ SSL และ proxy ไปที่พอร์ต 3000
