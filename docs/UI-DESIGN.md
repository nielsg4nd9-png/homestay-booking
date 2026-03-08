# การออกแบบ UI ของระบบจองห้องพักโฮมสเตย์

เอกสารรวบรวมการออกแบบ UI ทั้งระบบ (สี แบบอักษร เลย์เอาต์ คอมโพเนนต์ และโครงสร้างหน้า) เพื่อให้พัฒนาหรือปรับปรุงต่อได้สม่ำเสมอ

---

## 1. ภาพรวม Design System

- **Framework:** Next.js 13 (App Router) + Tailwind CSS
- **Component library:** Radix UI (Dialog, Dropdown, Slot) + shadcn-style (Button, Card, Input, Sheet)
- **โทนหลัก:** สีเขียว (emerald) เป็น accent สำหรับปุ่มหลัก ลิงก์ และแบรนด์
- **โทนรอง:** เทา (gray) สำหรับพื้นหลัง ขอบ และข้อความรอง

---

## 2. Typography (แบบอักษร)

| การใช้ | ค่า | หมายเหตุ |
|--------|-----|----------|
| **Font family** | `Prompt` (Google Font) | ผ่าน `--font-sans` ใน layout, รองรับไทย + ลาติน |
| **น้ำหนัก** | 400, 500, 600, 700 | ใช้ใน Tailwind `font-normal`, `font-medium`, `font-semibold`, `font-bold` |
| **หัวข้อหลัก (H1)** | `text-3xl`–`text-5xl`, `font-bold`, `tracking-tight` | หน้าแรก Hero, หน้าหลักแต่ละส่วน |
| **หัวข้อรอง (H2)** | `text-2xl`–`text-xl`, `font-bold` หรือ `font-semibold` | หัวข้อ section |
| **ข้อความปกติ** | `text-sm`–`text-base` | body, description |
| **ข้อความรอง** | `text-sm text-muted-foreground` หรือ `text-gray-500` | คำอธิบาย, caption |

- ภาษา: `lang="th"` ใน `<html>` และใช้ `toLocaleDateString('th-TH')` สำหรับวันที่

---

## 3. สี (Colors)

### 3.1 CSS Variables (globals.css / Tailwind)

ใช้ใน component ผ่าน Tailwind semantic names:

| Token | การใช้ |
|-------|--------|
| `--background` / `background` | พื้นหลังหลัก |
| `--foreground` / `foreground` | ข้อความหลัก |
| `--card`, `--card-foreground` | การ์ดและข้อความในการ์ด |
| `--muted`, `--muted-foreground` | พื้นหลังอ่อน + ข้อความรอง |
| `--primary`, `--primary-foreground` | ปุ่ม/ลิงก์หลัก (โทนเทาใน theme ปัจจุบัน) |
| `--destructive` | ปุ่มลบ / ออกจากระบบ |
| `--border`, `--input`, `--ring` | ขอบ, ช่องกรอก, โฟกัส |
| `--radius` | มุมโค้ง (0.5rem) |

### 3.2 สี Emerald (แบรนด์ + ปุ่มหลัก)

- **ปุ่มหลัก / CTA:** `bg-emerald-600 hover:bg-emerald-700` (ข้อความขาว)
- **ลิงก์:** `text-emerald-600 hover:text-emerald-700` หรือ `text-emerald-800`
- **แท็ก / badge:** `bg-emerald-50 text-emerald-700`, `border-white/30 bg-white/20` (บน Hero)
- **ข้อความสำคัญ:** `text-emerald-600`, `text-emerald-700`, `text-emerald-800`

### 3.3 สีเทา (Neutral)

- **ข้อความหลัก:** `text-gray-800`, `text-foreground`
- **ข้อความรอง:** `text-gray-500`, `text-gray-600`, `text-muted-foreground`
- **พื้นหลัง:** `bg-gray-50`, `bg-muted/50`, `bg-white`
- **ขอบ:** `border-gray-100`, `border-gray-200`, `border-border`

### 3.4 สีสถานะ

- **ข้อผิดพลาด:** `text-destructive`, `text-red-600`, `bg-red-50`
- **ออกจากระบบ:** `text-red-600`, `border-red-200`, `hover:bg-red-50`

---

## 4. Layout โครงหลัก

### 4.1 Root Layout (ทุกหน้า)

```
┌─────────────────────────────────────────┐
│  SiteHeader (sticky, z-50)               │
├─────────────────────────────────────────┤
│  <main className="min-h-screen bg-muted/50">  │
│    {children}                            │
│  </main>                                 │
├─────────────────────────────────────────┤
│  Footer (border-t, ขาว, ข้อความเทา)     │
└─────────────────────────────────────────┘
```

- **Header:** `sticky top-0 z-50`, `border-b`, `bg-background/95 backdrop-blur`
- **Main:** `min-h-screen bg-muted/50`
- **Footer:** `border-t border-gray-200 bg-white`, ข้อความเล็กสีเทา กึ่งกลาง

### 4.2 Container

- **ความกว้าง:** `container mx-auto max-w-6xl` (หน้าหลัก), `max-w-4xl` (หน้ารายละเอียดห้อง), `max-w-3xl` (จอง/เช็คจอง), `max-w-5xl` (เกี่ยวกับเรา)
- **Padding:** `px-4 py-8 sm:px-6 sm:py-10 lg:px-8` (หรือใกล้เคียง)

### 4.3 Admin Layout (หลังบ้าน)

```
┌──────────────┬────────────────────────────────────┐
│  Sidebar     │  Main content                      │
│  (aside)     │  (AdminPageContainer)               │
│  - หลังบ้าน  │  - แดชบอร์ด / ตาราง / ฟอร์ม        │
│  - แดชบอร์ด  │                                    │
│  - จัดการห้อง │  p-4 sm:p-6 md:p-8                 │
│  - รายการจอง │  max-w-none                        │
│  - ...       │                                    │
│  - ออกจากระบบ│                                    │
└──────────────┴────────────────────────────────────┘
```

- **พื้นหลัง:** `bg-gray-50`, sidebar `bg-white`, ขอบ `border-gray-200`
- **Sidebar:** `md:w-56`, ลิงก์ `text-gray-700 hover:bg-gray-100`, หัวข้อ `text-emerald-800`
- **Mobile:** sidebar เป็นแถวแนวนอน (flex-row) scroll ได้

---

## 5. Components หลัก

### 5.1 Button (`@/components/ui/button`)

- **Variants:** `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`
- **Sizes:** `default` (h-9) | `sm` | `lg` | `icon`
- **การใช้งานหลัก:**
  - ปุ่ม CTA: `variant="default"` หรือ override เป็น `bg-emerald-600 hover:bg-emerald-700`
  - ปุ่มรอง: `variant="outline"`
  - เมนูมือถือ / ไอคอน: `variant="ghost" size="icon"`
- **Focus:** `focus-visible:ring-1 focus-visible:ring-ring`

### 5.2 Card (`@/components/ui/card`)

- **Card:** `rounded-xl border bg-card text-card-foreground shadow`
- **CardHeader:** `flex flex-col space-y-1.5 p-6`
- **CardTitle:** `font-semibold leading-none tracking-tight`
- **CardDescription:** `text-sm text-muted-foreground`
- **CardContent:** `p-6 pt-0`
- **CardFooter:** `flex items-center p-6 pt-0`
- ใช้ใน: หน้าหลัก (สินค้า/ห้อง/ข่าว), ล็อกอิน, สมัครสมาชิก, เช็คจอง, เกี่ยวกับเรา

### 5.3 Input (`@/components/ui/input`)

- สไตล์จาก Tailwind + border/ring ตาม design tokens
- **globals.css:** กำหนด `color: #111827` และ placeholder `#6b7280` เพื่อให้อ่านชัด (รวม dark mode)

### 5.4 SiteHeader

- **โลโก้/ชื่อ:** ลิงก์ไป `/`, `text-emerald-700 font-semibold`
- **Nav (Desktop):** ลิงก์ `text-muted-foreground hover:text-foreground`, ช่องว่าง `gap-6` / `gap-8`
- **ผู้ใช้ล็อกอิน:** Dropdown (Radix) ปุ่ม outline + ไอคอน UserCircle2, เมนู "ข้อมูลผู้ใช้" + "ออกจากระบบ" (สีแดง)
- **ยังไม่ล็อกอิน:** ปุ่ม "สมัครสมาชิก" `bg-emerald-600 hover:bg-emerald-700`
- **Mobile:** Sheet (drawer) ด้านขวา ความกว้าง 280–320px, ลิงก์แบบบล็อก `rounded-lg px-3 py-2.5`

### 5.5 Admin UI (`@/components/admin/AdminUI`)

- **AdminPageContainer:** `p-4 sm:p-6 md:p-8`, `max-w-none`
- **AdminPageHeader:** หัวข้อ `text-xl sm:text-2xl font-bold text-gray-800`, คำอธิบาย `text-sm text-gray-500`, รองรับ `actions` ด้านขวา
- **AdminTableCard:** `bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden` ใช้ห่อตารางหรือบล็อกเนื้อหา

### 5.6 อื่นๆ

- **Sheet:** เมนูมือถือ (Radix)
- **DropdownMenu:** เมนูผู้ใช้ใน header
- **RoomImage:** แสดงรูปห้อง รองรับ placeholder / error state
- **HeroBackgroundSlideshow:** สไลด์พื้นหลัง Hero ด้วยรูปหรือ gradient สีเขียว

---

## 6. โครงสร้างแต่ละหน้า (สรุป)

| หน้า | path | โครงสร้างหลัก |
|------|------|----------------|
| หน้าหลัก | `/` | Hero (slideshow + overlay) → Section สินค้าแนะนำ (Card grid) → Section ห้องพัก (Card grid) → Section ข่าว/อัปเดต → Section CTA |
| บริการ | `/services` | Container → รายการสินค้า/บริการ (Card) + รายการห้องย่อ |
| เกี่ยวกับเรา | `/about` | Container → Section ข้อความ + แท็ก → Grid การ์ด (จุดเด่น/ที่ตั้ง/ติดต่อ) → แกลเลอรี่ห้อง |
| ล็อกอิน | `/login` | Centered Card (max-w-md) บน bg-muted/50, ฟอร์ม + ลิงก์สมัคร |
| สมัครสมาชิก | `/register` | เหมือนล็อกอิน |
| รายละเอียดห้อง | `/rooms/[slug]` | คอนเทนเนอร์ → บล็อกรูป (aspect 16/9) + ข้อมูลห้อง + แท็ก amenities → บล็อก "จองห้องนี้" (BookingForm หรือปุ่มเข้าสู่ระบบ) |
| เช็คการจอง | `/booking/check` | Container → หัวข้อกลาง → Card รายการจอง (ตาราง/การ์ดตามสถานะ) |
| จองสำเร็จ | `/booking/success` | หน้าแสดงผลหลังจอง |
| โปรไฟล์ | `/profile` | ข้อมูลผู้ใช้ (Card) |
| แดชบอร์ดแอดมิน | `/admin` | AdminPageContainer + AdminPageHeader + grid การ์ดสถิติ (ห้อง/จอง/ผู้ใช้/บริการ) + AdminTableCard รายการจองล่าสุด |
| จัดการห้อง/จอง/บริการ/สไลด์/ผู้ใช้ | `/admin/*` | Sidebar + AdminPageContainer, ใช้ AdminPageHeader + AdminTableCard หรือฟอร์มใน Card |

---

## 7. รูปแบบที่ใช้ซ้ำ (Patterns)

- **Section หัวข้อ + ปุ่มดูทั้งหมด:** `flex items-end justify-between` หัวข้อ (H2 + description) + Button outline size sm
- **Card grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (หรือ 4 สำหรับแดชบอร์ด)
- **ฟอร์มใน Card:** Card > CardHeader (title + description) > CardContent > form `space-y-4` แต่ละช่อง `space-y-2` (label + Input)
- **ตารางแอดมิน:** thead `bg-gray-50`, th `py-3.5 px-5 font-medium text-gray-700`, แถว hover `hover:bg-gray-50/60`
- **แท็ก:** `rounded-full` + `px-3 py-1` + สี (emerald-50/emerald-700 หรือ white/20 บน Hero)

---

## 8. Responsive

- **Breakpoints:** ใช้ Tailwind มาตรฐาน (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Header:** nav แนวตั้งซ่อนบน mobile (hidden md:flex), เปิดด้วย Sheet
- **Admin:** sidebar จากแนวตั้ง (md) เป็นแถวแนวนอน + overflow-x บน mobile
- **Grid:** 1 คอลัมน์มือถือ, 2–3–4 คอลัมน์ตาม section และหน้า

---

## 9. ไฟล์อ้างอิงสำคัญ

| ไฟล์ | บทบาท |
|------|--------|
| `src/app/layout.tsx` | Root layout, font Prompt, Header/Footer |
| `src/app/globals.css` | CSS variables, สี input/placeholder |
| `tailwind.config.ts` | fontFamily, container, colors, radius |
| `src/components/SiteHeader.tsx` | Header + nav + mobile Sheet |
| `src/app/admin/layout.tsx` | Sidebar แอดมิน |
| `src/components/ui/button.tsx` | ปุ่ม variants/sizes |
| `src/components/ui/card.tsx` | Card ชุด |
| `src/components/admin/AdminUI.tsx` | Container / Header / TableCard แอดมิน |
| `src/components/RoomImage.tsx` | รูปห้อง + fallback |
| `src/components/HeroBackgroundSlideshow.tsx` | Hero พื้นหลัง |

---

เอกสารนี้รวบรวมการออกแบบ UI ทั้งระบบไว้ที่เดียว เพื่อใช้เป็นแนวทางเวลาเพิ่มหน้าใหม่หรือปรับสไตล์ให้สอดคล้องกันทั้งโปรเจกต์
