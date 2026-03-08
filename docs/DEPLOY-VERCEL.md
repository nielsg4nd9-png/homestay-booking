# Deploy บน Vercel

โปรเจกต์นี้ใช้ **Next.js 14** และบน Vercel จะใช้ **PostgreSQL** และ **Vercel Blob** อัตโนมัติ (local dev ใช้ SQLite ตามเดิม)

ถ้า deploy บน **AWS (SST/OpenNext)** หรือ serverless อื่นที่ใช้ OpenNext: โปรเจกต์อัปเกรดเป็น Next.js 14 แล้ว เพื่อแก้ error `Cannot find module page_client-reference-manifest.js` ที่เกิดกับ Next 13 บน OpenNext

---

## ⚠️ บังคับ: ตั้งค่า Environment Variables ก่อน deploy

ถ้า**ยังไม่ตั้งค่า**ตัวแปรด้านล่างบนแพลตฟอร์มที่ deploy (Vercel / AWS / อื่นๆ) เว็บจะขึ้น error เช่น:

- **`[next-auth][error][NO_SECRET]`** / **`Please define a secret in production`** → ยังไม่ได้ตั้ง `NEXTAUTH_SECRET`
- **`Environment variable not found: DATABASE_URL`** → ยังไม่ได้ตั้ง `DATABASE_URL`

**ต้องทำก่อน:** ไปที่โปรเจกต์ใน Vercel (หรือ AWS/แพลตฟอร์มที่ใช้) → **Settings** → **Environment Variables** → เพิ่มตัวแปรด้านล่างให้ครบ และเลือก Environment เป็น **Production** (และ Preview ถ้าใช้) จากนั้น **Redeploy**  
ถ้าใช้ **AWS (SST/OpenNext)** ให้ใส่ตัวแปรเดียวกันใน config ของ SST/Lambda environment

| ตัวแปร | ค่าตัวอย่าง | หมายเหตุ |
|--------|-------------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require&connect_timeout=15` | บังคับ — ใช้ Postgres; ถ้าใช้ **Neon** ต้องใช้ URL แบบ pooler และใส่ `sslmode=require&connect_timeout=15` |
| `NEXTAUTH_SECRET` | สร้างด้วย `openssl rand -base64 32` | บังคับ |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | บังคับ — ต้องตรง URL จริง ไม่มี `/` ท้าย |
| `BLOB_READ_WRITE_TOKEN` | จาก Vercel Blob | บังคับถ้ามีอัปโหลดรูป |

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
- **`NO_SECRET`** / **`Please define a secret in production`** → ยังไม่ได้ตั้ง `NEXTAUTH_SECRET` ใน Environment Variables
- **`Environment variable not found: DATABASE_URL`** → ยังไม่ได้ตั้ง `DATABASE_URL` ใน Environment Variables (หรือ scope ไม่รวม Production)
- `relation "User" does not exist` → ยังไม่ได้รัน `prisma db push` ให้สร้างตารางใน Postgres
- `Invalid \`url\`` → ยังไม่ได้ตั้งค่า NEXTAUTH_URL ให้ตรง URL จริง
- **`Can't reach database server`** → ดู [ถ้าใช้ Neon และเจอ Can't reach database server](#ถ้าใช้-neon-และเจอ-cant-reach-database-server) ด้านล่าง หรือตรวจสอบเครือข่าย/ไฟร์วอลล์

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

---

## ถ้าใช้ Neon และเจอ Can't reach database server

โปรเจกต์นี้ใช้ **Prisma 6** และเมื่อ deploy บน **Vercel หรือ AWS Lambda** กับ **Neon** จะใช้ **Neon serverless driver** อัตโนมัติ (เชื่อมผ่าน WebSocket แทน TCP) เพื่อลดปัญหา "Can't reach database server" ถ้ายังเจอ error ให้ตั้งค่า **DATABASE_URL** ดังนี้:

### 1. ใช้ Connection แบบ Pooler (บังคับ)

ใน Neon Console เลือก **Connection pooling** แล้วคัดลอก connection string ที่มี **-pooler** ใน host (เช่น `ep-xxx-pooler.us-east-1.aws.neon.tech`)

### 2. ใส่ query parameters ใน URL (บังคับ)

ต่อท้าย URL ด้วย **`?sslmode=require&connect_timeout=15`** (ถ้ามี `?` อยู่แล้วให้ใช้ `&` แทน)

**ตัวอย่างที่ถูกต้อง:**

```text
postgresql://user:password@ep-damp-paper-aiaub34v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15
```

- **sslmode=require** — Neon ต้องใช้ SSL
- **connect_timeout=15** — ให้เวลา serverless (Lambda) เชื่อมต่อนานขึ้น ลดโอกาส timeout ตอน cold start

### 3. ตรวจในแพลตฟอร์ม deploy

ไปที่ **Settings** → **Environment Variables** → แก้ `DATABASE_URL` ให้เป็นรูปแบบด้านบน (มี `sslmode=require` และ `connect_timeout=15`) จากนั้น **Redeploy**

### 4. ถ้ายังเชื่อมไม่ได้ (โดยเฉพาะบน AWS Lambda)

- **ตรวจว่า Lambda ออกเน็ตได้** — ถ้า Lambda อยู่ใน VPC ที่ไม่มี NAT Gateway / outbound internet จะเชื่อม Neon ไม่ได้ ต้องเปิด outbound หรือเอา Lambda ออกจาก VPC
- **ลอง deploy บน Vercel** — Vercel มักเชื่อม Neon ได้เสถียรกว่า Lambda
- **ลองเพิ่ม connect_timeout** — ใส่ `connect_timeout=30` แทน 15 แล้ว Redeploy
