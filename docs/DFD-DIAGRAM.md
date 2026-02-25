# DFD — โปรเจค Homestay Booking

## Level 0 (Context Diagram)

```mermaid
flowchart LR
    subgraph External
        Guest[ผู้ใช้/ลูกค้า]
        Admin[แอดมิน/พนักงาน]
    end

    subgraph System["ระบบ Homestay Booking"]
        SYS[(เว็บแอป\nNext.js)]
    end

    subgraph DataStore
        DB[(ฐานข้อมูล\nSQLite)]
        FS[(ไฟล์รูป\npublic/uploads)]
    end

    Guest -->|ลงทะเบียน, ล็อกอิน, ดูห้อง, จอง, อัปโหลดสลิป| SYS
    SYS -->|แสดงห้อง, ยืนยันจอง, สถานะมัดจำ| Guest
    Admin -->|ล็อกอิน, จัดการห้อง/จอง/ผู้ใช้/สินค้า/สไลด์, ตรวจสลิป| SYS
    SYS -->|แดชบอร์ด, รายงาน| Admin
    SYS --> DB
    SYS --> FS
```

## Level 1 — ฝั่งผู้ใช้ (Guest)

```mermaid
flowchart TB
    subgraph External
        G[ผู้ใช้/ลูกค้า]
    end

    subgraph Processes
        P1[1.0 ลงทะเบียน/ล็อกอิน]
        P2[2.0 ดูห้องและสินค้า]
        P3[3.0 สร้างการจอง]
        P4[4.0 อัปโหลดสลิปมัดจำ]
    end

    subgraph DataStores
        D1[(User)]
        D2[(Room)]
        D3[(Booking)]
        D4[(ServiceItem)]
        D5[(HeroSlide)]
        F1[(uploads)]
    end

    G -->|อีเมล, รหัสผ่าน| P1
    P1 -->|สร้าง/ตรวจสอบ| D1
    P1 -->|session| G

    G -->|เปิดหน้าหลัก/ห้อง/บริการ| P2
    D2 --> P2
    D4 --> P2
    D5 --> P2
    P2 -->|HTML/ข้อมูล| G

    G -->|วันเช็คอิน/เอาท์, จำนวนคน, ชื่อ| P3
    P3 -->|ตรวจห้องว่าง| D2
    P3 -->|สร้างรายการ| D3
    P3 -->|ยืนยันจอง| G

    G -->|ไฟล์รูปสลิป| P4
    P4 -->|บันทึกไฟล์| F1
    P4 -->|อัปเดต depositSlipUrl, สถานะ| D3
    P4 -->|ผลลัพธ์| G
```

## Level 1 — ฝั่งแอดมิน (Admin)

```mermaid
flowchart TB
    subgraph External
        A[แอดมิน/พนักงาน]
    end

    subgraph Processes
        A1[1.0 ล็อกอินหลังบ้าน]
        A2[2.0 จัดการห้องพัก]
        A3[3.0 จัดการรายการจอง]
        A4[4.0 ตรวจสลิปมัดจำ]
        A5[5.0 จัดการผู้ใช้]
        A6[6.0 จัดการสินค้า/บริการ]
        A7[7.0 จัดการสไลด์หน้าแรก]
        A8[8.0 อัปโหลดรูป]
    end

    subgraph DataStores
        D1[(User)]
        D2[(Room)]
        D3[(Booking)]
        D4[(ServiceItem)]
        D5[(HeroSlide)]
        F1[(uploads)]
    end

    A -->|อีเมล, รหัสผ่าน| A1
    A1 --> D1
    A1 -->|session, role| A

    A -->|เพิ่ม/แก้/ลบห้อง| A2
    A2 --> D2
    A -->|อัปโหลดรูปห้อง| A8
    A8 --> F1
    A2 --> A8

    A -->|ดูรายการจอง, เปลี่ยนสถานะมัดจำ| A3
    D3 --> A3
    A3 --> D3

    A -->|อนุมัติ/ปฏิเสธสลิป| A4
    A4 --> D3

    A -->|เปลี่ยน role| A5
    A5 --> D1

    A -->|เพิ่ม/แก้/ลบสินค้า-บริการ| A6
    A6 --> D4
    A6 --> A8

    A -->|เพิ่ม/แก้/ลบสไลด์| A7
    A7 --> D5
    A7 --> A8
```

## สรุปกระบวนการหลัก (Process Summary)

| เลขที่ | กระบวนการ | ข้อมูลเข้า | ข้อมูลออก | Data Store |
|--------|-----------|------------|-----------|------------|
| 1.0 | ลงทะเบียน/ล็อกอิน | email, password, name | session, token | User |
| 2.0 | ดูห้องและสินค้า | - | หน้าเว็บ, รายการ Room/ServiceItem/HeroSlide | Room, ServiceItem, HeroSlide |
| 3.0 | สร้างการจอง | roomId, checkIn, checkOut, guests, guestName | bookingId, ยืนยัน | Room, Booking |
| 4.0 | อัปโหลดสลิปมัดจำ | bookingId, ไฟล์รูป | depositSlipUrl, สถานะ SUBMITTED | Booking, uploads |
| 2.0 (Admin) | จัดการห้องพัก | CRUD Room, รูป | อัปเดต Room | Room, uploads |
| 3.0 (Admin) | จัดการรายการจอง | ดู/กรอง/เปลี่ยนสถานะมัดจำ | รายงานจอง | Booking |
| 4.0 (Admin) | ตรวจสลิปมัดจำ | อนุมัติ/ปฏิเสธ + หมายเหตุ | depositPaid, depositReviewedAt | Booking |
| 5.0 (Admin) | จัดการผู้ใช้ | เปลี่ยน role | อัปเดต User | User |
| 6.0 (Admin) | จัดการสินค้า/บริการ | CRUD ServiceItem | อัปเดต ServiceItem | ServiceItem, uploads |
| 7.0 (Admin) | จัดการสไลด์หน้าแรก | CRUD HeroSlide | อัปเดต HeroSlide | HeroSlide, uploads |
| 8.0 | อัปโหลดรูป | ไฟล์รูป | URL path | uploads |

## หมายเหตุ

- การจองใช้ `getServerSession` เพื่อดึง guestEmail จาก User ที่ล็อกอิน
- หลังบ้านทุก process ตรวจสิทธิ์ role (ADMIN/EMPLOYEE) ผ่าน session หรือ middleware
