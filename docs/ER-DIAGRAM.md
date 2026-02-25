# ER Diagram — โปรเจค Homestay Booking

## Entity-Relationship Diagram (Mermaid)

```mermaid
erDiagram
    User ||--o{ Booking : "จอง (guestEmail)"
    Room ||--o{ Booking : "ถูกจอง"
    User {
        string id PK
        string name
        string email UK
        string password
        string role "ADMIN|EMPLOYEE|USER"
        datetime createdAt
        datetime updatedAt
    }

    Room {
        string id PK
        string name
        string slug UK
        string description
        int pricePerNight
        int maxGuests
        string imageUrl
        string amenities
        datetime createdAt
        datetime updatedAt
    }

    Booking {
        string id PK
        string roomId FK
        string guestName
        string guestEmail
        string guestPhone
        datetime checkIn
        datetime checkOut
        int guests
        int totalPrice
        boolean depositPaid
        datetime depositPaidAt
        string depositSlipUrl
        datetime depositSlipSubmittedAt
        string depositVerificationStatus
        datetime depositReviewedAt
        string depositReviewNote
        string note
        datetime createdAt
        datetime updatedAt
    }

    ServiceItem {
        string id PK
        string name
        string slug UK
        string type "SERVICE|PRODUCT"
        string description
        string imageUrl
        int price
        string unit
        boolean isActive
        int sortOrder
        datetime createdAt
        datetime updatedAt
    }

    HeroSlide {
        string id PK
        string title
        string subtitle
        string imageUrl
        boolean isActive
        int sortOrder
        datetime createdAt
        datetime updatedAt
    }

    User ||--o{ Booking : guestEmail
    Room ||--o{ Booking : roomId
```

## อธิบายความสัมพันธ์

| ความสัมพันธ์ | ประเภท | คำอธิบาย |
|--------------|--------|----------|
| **User — Booking** | 1:N (อ้างอิงด้วย guestEmail) | ผู้ใช้หนึ่งคนสามารถมีหลายการจอง (ใช้ email โยง ไม่มี FK โดยตรง) |
| **Room — Booking** | 1:N | ห้องหนึ่งห้องมีได้หลายการจอง (Booking.roomId → Room.id) |
| **ServiceItem** | ไม่มี FK | ใช้แสดงสินค้า/บริการบนเว็บ (จัดการในหลังบ้าน) |
| **HeroSlide** | ไม่มี FK | ใช้แสดงสไลด์หน้าแรก (จัดการในหลังบ้าน) |

## หมายเหตุ

- **User.role**: `ADMIN` | `EMPLOYEE` | `USER` (เก็บเป็น String ใน SQLite)
- **Booking.depositVerificationStatus**: `NONE` | `SUBMITTED` | `APPROVED` | `REJECTED`
- **ServiceItem.type**: `SERVICE` | `PRODUCT`
- ไฟล์อัปโหลด (รูปห้อง, สลิปมัดจำ) เก็บ path ใน DB (เช่น `imageUrl`, `depositSlipUrl`) ส่วนไฟล์จริงอยู่ที่ `public/uploads`
