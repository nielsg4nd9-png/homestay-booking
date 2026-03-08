# Deploy บน Vercel

โปรเจกต์นี้บน Vercel จะใช้ **PostgreSQL** และ **Vercel Blob** อัตโนมัติ (local dev ใช้ SQLite ตามเดิม)

---

## 1. เตรียมฐานข้อมูล PostgreSQL

Vercel ไม่รองรับ SQLite ต้องใช้ PostgreSQL จากบริการใดบริการหนึ่ง:

| บริการ | หมายเหตุ |
|--------|----------|
| **Vercel Postgres** | ใน Vercel Dashboard > Storage > Create Database > Postgres |
| **Neon** | [neon.tech](https://neon.tech) — มี free tier, คัดลอก connection string |
| **Supabase** | [supabase.com](https://supabase.com) — มี free tier |

ได้ connection string แบบนี้:
```text
postgresql://user:password@host.region.aws.neon.tech/neondb?sslmode=require
```

---

## 2. เตรียม Vercel Blob (อัปโหลดรูป)

บน Vercel filesystem เป็น read-only จึงต้องใช้ Blob Storage:

1. ใน Vercel Dashboard ไปที่โปรเจกต์
2. **Storage** > **Create Database** > เลือก **Blob**
3. สร้างแล้วจะได้ **BLOB_READ_WRITE_TOKEN** อัตโนมัติ (หรือไปที่ Storage > Blob > .env.local)

ใส่ตัวแปรนี้ใน Environment Variables ของโปรเจกต์ (หรือใน Vercel จะผูกให้อัตโนมัติถ้าสร้าง Blob ในโปรเจกต์เดียวกัน)

---

## 3. Deploy จาก Git

1. Push โค้ดขึ้น GitHub/GitLab/Bitbucket
2. ไปที่ [vercel.com](https://vercel.com) > **Add New** > **Project** > เลือก repo
3. **Environment Variables** ใส่ค่าดังนี้:

| Name | Value | หมายเหตุ |
|------|--------|----------|
| `DATABASE_URL` | `postgresql://...` | จากขั้นตอนที่ 1 |
| `NEXTAUTH_SECRET` | สร้างด้วย `openssl rand -base64 32` | บังคับ |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | หลัง deploy ครั้งแรกให้ใส่ URL จริง (หรือ custom domain) |
| `BLOB_READ_WRITE_TOKEN` | จาก Vercel Blob | ถ้าเปิด Blob ในโปรเจกต์อาจมีให้แล้ว |

ตัวแปร `NEXT_PUBLIC_PAYMENT_*` ใส่ได้ตามต้องการ (แสดงบัญชีรับโอนในหน้าจอง)

4. กด **Deploy**

---

## 4. สร้างตารางหลัง Deploy ครั้งแรก

หลัง deploy เสร็จ ฐานข้อมูลยังไม่มีตาราง ให้รันคำสั่งจากเครื่องตัวเอง (ที่มี `.env` ชี้ไปที่ DB ตัวเดียวกัน):

```bash
# ใส่ DATABASE_URL ใน .env ให้ชี้ไปที่ Postgres บน Vercel/Neon
npx prisma db push
npm run db:seed   # ถ้าต้องการข้อมูลตัวอย่าง
```

หรือใช้ Vercel Postgres จาก Dashboard แล้วรัน **Query** เองก็ได้ แต่แนะนำใช้ `prisma db push` จาก local จะตรงกับ schema ล่าสุด

---

## 5. ตั้งค่า NEXTAUTH_URL หลัง Deploy

หลัง deploy จะได้ URL แบบ `https://homestay-booking-xxx.vercel.app`

1. ไปที่ Project > **Settings** > **Environment Variables**
2. แก้ `NEXTAUTH_URL` เป็น URL จริง เช่น `https://homestay-booking-xxx.vercel.app`
3. **Redeploy** (Deployments > ... > Redeploy) เพื่อให้ env ใหม่มีผล

---

## สรุปตัวแปรที่ต้องมีบน Vercel

| ตัวแปร | บังคับ |
|--------|--------|
| `DATABASE_URL` (PostgreSQL) | ✅ |
| `NEXTAUTH_SECRET` | ✅ |
| `NEXTAUTH_URL` | ✅ (ต้องตรง URL จริง) |
| `BLOB_READ_WRITE_TOKEN` | ✅ (ถ้ามีฟีเจอร์อัปโหลดรูป) |
| `NEXT_PUBLIC_PAYMENT_*` | ไม่บังคับ |

ถ้าไม่ใส่ `BLOB_READ_WRITE_TOKEN` หน้า upload รูปจะ error เพราะบน Vercel ไม่สามารถเขียนไฟล์ลง disk ได้

---

## แก้ไขเมื่อเจอ 500 Internal Server Error

ถ้าเปิดเว็บแล้วขึ้น **500 Internal Server Error** ให้ตรวจตามนี้:

### 1. ดู error จริงจาก Vercel

1. ไปที่ Vercel Dashboard > เลือกโปรเจกต์
2. เปิด **Deployments** > คลิก deployment ล่าสุด
3. ไปที่แท็บ **Functions** หรือ **Runtime Logs** (หรือ **Logs**) แล้วดู error message

มักจะเห็นข้อความเช่น:
- `relation "User" does not exist` → ยังไม่ได้รัน `prisma db push` ให้สร้างตารางใน Postgres
- `NEXTAUTH_SECRET` / `Invalid `url`` → ยังไม่ได้ตั้งค่า NEXTAUTH_SECRET หรือ NEXTAUTH_URL
- `Can't reach database server` → DATABASE_URL ผิด หรือเครือข่าย/ไฟร์วอลล์บล็อก

### 2. ตรวจสอบ Environment Variables

ใน **Settings** > **Environment Variables** ต้องมีครบ (และเลือก scope **Production**):

- `DATABASE_URL` = connection string ของ PostgreSQL (ขึ้นต้นด้วย `postgresql://` หรือ `postgres://`)
- `NEXTAUTH_SECRET` = สร้างด้วย `openssl rand -base64 32`
- `NEXTAUTH_URL` = URL จริงของเว็บ เช่น `https://your-project.vercel.app` (ไม่มี slash ท้าย)

หลังแก้ env ให้ **Redeploy** (Deployments > ... > Redeploy) เพื่อให้ค่าใหม่มีผล

### 3. สร้างตารางในฐานข้อมูล (สำคัญมาก)

ถ้ายังไม่เคยรัน migration บน Postgres ที่ใช้กับ Vercel:

```bash
# ในเครื่องตัวเอง ใส่ .env ให้ DATABASE_URL ชี้ไปที่ Postgres ตัวเดียวกับที่ Vercel ใช้
npx prisma db push
npm run db:seed   # ถ้าต้องการข้อมูลตัวอย่าง
```

ถ้าข้ามขั้นตอนนี้ หน้าแรกหรือทุกหน้าที่เรียก Prisma จะ error 500 เพราะยังไม่มีตาราง

### 4. ทดสอบว่าแอปและ DB ทำงาน

เปิดในเบราว์เซอร์:

- `https://your-project.vercel.app/api/health`

ถ้าได้ `{ "ok": true, "db": "ok" }` แปลว่าแอปและ DB เชื่อมต่อได้ปกติ  
ถ้าได้ `{ "ok": true, "db": "error" }` แปลว่าแอปขึ้นแล้วแต่เชื่อม DB ไม่ได้ → ตรวจสอบ DATABASE_URL และว่ามีการรัน `prisma db push` แล้ว
