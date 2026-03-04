# Sequence Diagram — โปรเจค Homestay Booking

## 1. ลงทะเบียนและล็อกอิน (Register & Login)

```mermaid
sequenceDiagram
    actor User as ผู้ใช้
    participant Page as หน้าเว็บ
    participant API as API Route
    participant Auth as NextAuth
    participant DB as ฐานข้อมูล

    Note over User, DB: ลงทะเบียน
    User->>Page: กรอก name, email, password
    Page->>API: POST /api/auth/register
    API->>DB: ตรวจสอบ email ซ้ำ
    alt email มีแล้ว
        DB-->>API: พบ email
        API-->>Page: 400 Conflict
        Page-->>User: แสดงข้อความ error
    else email ยังไม่มี
        API->>DB: hash password, สร้าง User
        DB-->>API: User
        API-->>Page: 201 Created
        Page-->>User: ไปหน้า login
    end

    Note over User, DB: ล็อกอิน
    User->>Page: กรอก email, password
    Page->>Auth: signIn('credentials', { email, password })
    Auth->>DB: ค้นหา User, เปรียบเทียบ password
    DB-->>Auth: User + role
    Auth-->>Page: session (JWT)
    Page-->>User: redirect ไปหน้าหลัก/โปรไฟล์
```

---

## 2. การจองห้อง (Create Booking)

```mermaid
sequenceDiagram
    actor Guest as ลูกค้า
    participant RoomPage as หน้ารายละเอียดห้อง
    participant API as API Bookings
    participant DB as ฐานข้อมูล

    Guest->>RoomPage: เลือก checkIn, checkOut, guests, กรอกชื่อ/อีเมล/โทร
    RoomPage->>RoomPage: คำนวณ totalPrice, deposit 50%
    Guest->>RoomPage: กดยืนยันจอง
    RoomPage->>API: POST /api/bookings { roomId, checkIn, checkOut, guests, guestName, guestEmail, ... }
    API->>DB: ตรวจสอบห้องว่าง (ไม่มี booking ทับช่วง)
    alt วันนั้นมีคนจองแล้ว
        DB-->>API: พบการจองทับ
        API-->>RoomPage: 400 room not available
        RoomPage-->>Guest: แสดงข้อความห้องไม่ว่าง
    else ห้องว่าง
        API->>DB: สร้าง Booking (depositVerificationStatus: NONE)
        DB-->>API: Booking
        API-->>RoomPage: 201 { id, totalPrice, ... }
        RoomPage-->>Guest: redirect /booking/success?id=...
    end
```

---

## 3. อัปโหลดสลิปมัดจำ (Upload Deposit Slip)

```mermaid
sequenceDiagram
    actor Guest as ลูกค้า
    participant CheckPage as หน้าเช็คการจอง
    participant UploadAPI as API Upload
    participant SlipAPI as API Deposit Slip
    participant DB as ฐานข้อมูล
    participant FS as ระบบไฟล์

    Guest->>CheckPage: กรอก email, เลือกการจอง
    CheckPage->>CheckPage: GET /api/bookings/[id] (เช็ค email ตรง)
    CheckPage-->>Guest: แสดงรายการจอง + ปุ่มแนบสลิป

    Guest->>CheckPage: เลือกไฟล์รูปสลิป → กดอัปโหลด
    CheckPage->>UploadAPI: POST /api/upload (FormData รูป)
    UploadAPI->>FS: บันทึกไฟล์ใน public/uploads
    FS-->>UploadAPI: path/url
    UploadAPI-->>CheckPage: { url }

    CheckPage->>SlipAPI: PATCH /api/bookings/[id]/deposit-slip { depositSlipUrl }
    SlipAPI->>DB: อัปเดต Booking (depositSlipUrl, depositSlipSubmittedAt, depositVerificationStatus: SUBMITTED)
    DB-->>SlipAPI: OK
    SlipAPI-->>CheckPage: 200
    CheckPage-->>Guest: แสดงสถานะ "รอตรวจสอบ"
```

---

## 4. แอดมินตรวจสลิปมัดจำ (Admin Review Deposit)

```mermaid
sequenceDiagram
    actor Admin as แอดมิน
    participant AdminPage as หน้ารายการจอง (Admin)
    participant API as API Admin
    participant DB as ฐานข้อมูล

    Admin->>AdminPage: ล็อกอิน → เปิดหน้ารายการจอง
    AdminPage->>API: GET รายการจอง (หรือผ่าน server component)
    API->>DB: query Booking + Room
    DB-->>AdminPage: รายการจอง + สถานะมัดจำ

    Admin->>AdminPage: เลือกจองที่ส่งสลิปแล้ว → อนุมัติ/ปฏิเสธ
    AdminPage->>API: PATCH /api/admin/bookings/[id]/deposit-review { status: APPROVED|REJECTED, note? }
    API->>API: ตรวจสอบ session (role ADMIN/EMPLOYEE)
    API->>DB: อัปเดต depositVerificationStatus, depositReviewedAt, depositReviewNote; ถ้า APPROVED → depositPaid=true, depositPaidAt=now
    DB-->>API: OK
    API-->>AdminPage: 200
    AdminPage-->>Admin: อัปเดตตาราง/แสดงผลสำเร็จ
```

---

## 5. แอดมินจัดการห้อง (Admin CRUD Room)

```mermaid
sequenceDiagram
    actor Admin as แอดมิน
    participant Page as หน้าจัดการห้อง
    participant API as API Admin Rooms
    participant UploadAPI as API Upload
    participant DB as ฐานข้อมูล

    Note over Admin, DB: เพิ่มห้อง
    Admin->>Page: กรอกชื่อ, คำอธิบาย, ราคา, จำนวนคน, อัปโหลดรูป
    Page->>UploadAPI: POST /api/upload (รูปห้อง)
    UploadAPI-->>Page: imageUrl
    Page->>API: POST /api/admin/rooms { name, slug, description, pricePerNight, imageUrl, ... }
    API->>DB: สร้าง Room
    DB-->>API: Room
    API-->>Page: 201
    Page-->>Admin: redirect รายการห้อง

    Note over Admin, DB: แก้ไข/ลบ
    Admin->>Page: แก้ไขหรือลบห้อง
    Page->>API: PATCH /api/admin/rooms/[id] หรือ DELETE
    API->>DB: อัปเดตหรือลบ Room (onDelete: Cascade → ลบ Booking ที่อ้างอิง)
    DB-->>API: OK
    API-->>Page: 200/204
    Page-->>Admin: อัปเดตหน้าจอ
```

---

## สรุปผู้ร่วมในไดอะแกรม

| ตัวย่อ / ชื่อ | ความหมาย |
|----------------|-----------|
| Page / หน้าเว็บ | Next.js page (client หรือ server component) |
| API Route | Route handler ใน `src/app/api/...` |
| NextAuth | การยืนยันตัวตน (signIn, session) |
| DB | Prisma + SQLite |
| FS | ระบบไฟล์ (public/uploads) |
