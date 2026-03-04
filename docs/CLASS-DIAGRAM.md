# Class Diagram — โปรเจค Homestay Booking

## Domain Model (จาก Prisma Schema)

```mermaid
classDiagram
    class User {
        +String id
        +String? name
        +String email
        +String password
        +String role
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Room {
        +String id
        +String name
        +String slug
        +String? description
        +Int pricePerNight
        +Int maxGuests
        +String? imageUrl
        +String? amenities
        +DateTime createdAt
        +DateTime updatedAt
        +getBookings()
    }

    class Booking {
        +String id
        +String roomId
        +String guestName
        +String guestEmail
        +String? guestPhone
        +DateTime checkIn
        +DateTime checkOut
        +Int guests
        +Int? totalPrice
        +Boolean depositPaid
        +DateTime? depositPaidAt
        +String? depositSlipUrl
        +DateTime? depositSlipSubmittedAt
        +String depositVerificationStatus
        +DateTime? depositReviewedAt
        +String? depositReviewNote
        +String? note
        +DateTime createdAt
        +DateTime updatedAt
        +getRoom()
    }

    class ServiceItem {
        +String id
        +String name
        +String slug
        +String type
        +String? description
        +String? imageUrl
        +Int? price
        +String? unit
        +Boolean isActive
        +Int sortOrder
        +DateTime createdAt
        +DateTime updatedAt
    }

    class HeroSlide {
        +String id
        +String? title
        +String? subtitle
        +String imageUrl
        +Boolean isActive
        +Int sortOrder
        +DateTime createdAt
        +DateTime updatedAt
    }

    Room "1" --> "*" Booking : roomId
    Booking --> Room : room
```

---

## ความสัมพันธ์ระหว่างคลาส (อธิบาย)

| ความสัมพันธ์ | ประเภท | คำอธิบาย |
|--------------|--------|----------|
| **Room → Booking** | 1:N (One-to-Many) | ห้องหนึ่งห้องมีได้หลายการจอง (Booking มีฟิลด์ roomId ชี้ไปที่ Room) |
| **User** | ไม่มี FK ไปยัง Booking | การจองใช้ guestEmail เป็นตัวระบุ ไม่มี foreign key ไปที่ User (ความสัมพันธ์เชิงตรรกะ) |
| **ServiceItem** | ไม่มีความสัมพันธ์กับคลาสอื่น | ใช้แสดงสินค้า/บริการในหน้าเว็บ |
| **HeroSlide** | ไม่มีความสัมพันธ์กับคลาสอื่น | ใช้แสดงสไลด์บนหน้าแรก |

---

## Class Diagram แบบมีชนิดข้อมูลและข้อความอธิบาย

```mermaid
classDiagram
    direction TB

    class User {
        <<entity>>
        -id: String [PK]
        -name: String?
        -email: String [unique]
        -password: String
        -role: String "ADMIN|EMPLOYEE|USER"
        -createdAt: DateTime
        -updatedAt: DateTime
    }

    class Room {
        <<entity>>
        -id: String [PK]
        -name: String
        -slug: String [unique]
        -description: String?
        -pricePerNight: Int
        -maxGuests: Int
        -imageUrl: String?
        -amenities: String?
        -createdAt: DateTime
        -updatedAt: DateTime
    }

    class Booking {
        <<entity>>
        -id: String [PK]
        -roomId: String [FK]
        -guestName: String
        -guestEmail: String
        -guestPhone: String?
        -checkIn: DateTime
        -checkOut: DateTime
        -guests: Int
        -totalPrice: Int?
        -depositPaid: Boolean
        -depositPaidAt: DateTime?
        -depositSlipUrl: String?
        -depositSlipSubmittedAt: DateTime?
        -depositVerificationStatus: String
        -depositReviewedAt: DateTime?
        -depositReviewNote: String?
        -note: String?
        -createdAt: DateTime
        -updatedAt: DateTime
    }

    class ServiceItem {
        <<entity>>
        -id: String [PK]
        -name: String
        -slug: String [unique]
        -type: String "SERVICE|PRODUCT"
        -description: String?
        -imageUrl: String?
        -price: Int?
        -unit: String?
        -isActive: Boolean
        -sortOrder: Int
        -createdAt: DateTime
        -updatedAt: DateTime
    }

    class HeroSlide {
        <<entity>>
        -id: String [PK]
        -title: String?
        -subtitle: String?
        -imageUrl: String
        -isActive: Boolean
        -sortOrder: Int
        -createdAt: DateTime
        -updatedAt: DateTime
    }

    Room "1" --> "*" Booking : has many
```

---

## Layer อื่น (อ้างอิงเท่านั้น)

ระบบใช้ Next.js App Router จึงไม่มีคลาสฝั่ง API แยกชัดแบบ OOP แต่มีกลุ่มหน้าที่หลักดังนี้:

| Layer | ที่อยู่ | หน้าที่ |
|-------|--------|--------|
| **API Routes** | `src/app/api/**/route.ts` | รับ HTTP request เรียก Prisma (อ่าน/เขียน DB) ส่ง response |
| **Pages** | `src/app/**/page.tsx` | แสดง UI และเรียก fetch ไป API หรือใช้ server component อ่านข้อมูล |
| **Components** | `src/components/` | UI ซ้ำใช้ร่วมกัน (เช่น AdminUI, HeroBackgroundSlideshow) |
| **ORM** | Prisma Client | สร้างจาก schema → ไม่ได้ประกาศคลาสในโค้ดโดยตรง แต่โมเดลใน schema สอดคล้องกับ Class Diagram ด้านบน |

---

*ไดอะแกรมอ้างอิงจาก `prisma/schema.prisma` — โมเดลจริงใช้ Prisma schema ไม่ได้เขียนเป็น class ใน TypeScript โดยตรง.*
