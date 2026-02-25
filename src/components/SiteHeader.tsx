'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, UserCircle2 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navLinkClass = cn(
  'text-muted-foreground hover:text-foreground transition-colors py-2 md:py-1'
)

type HeaderUser = {
  name?: string | null
  email?: string | null
  role?: string | null
}

export function SiteHeader({
  showBackOffice,
  user,
}: {
  showBackOffice: boolean
  user?: HeaderUser | null
}) {
  const [open, setOpen] = useState(false)
  const isLoggedIn = !!user?.email
  const role = user?.role ?? 'USER'
  const isStaff = role === 'ADMIN' || role === 'EMPLOYEE'
  const bookingLink = isStaff ? '/admin/bookings' : '/booking/check'
  const showBookingLink = isLoggedIn
  const profileLabel =
    user?.name?.trim() ||
    user?.email?.split('@')[0] ||
    'โปรไฟล์'

  const navLinks = (
    <>
      <Link href="/" className={navLinkClass} onClick={() => setOpen(false)}>
        หน้าหลัก
      </Link>
      <Link href="/services" className={navLinkClass} onClick={() => setOpen(false)}>
        สินค้าและบริการ
      </Link>
      <Link href="/about" className={navLinkClass} onClick={() => setOpen(false)}>
        เกี่ยวกับเรา
      </Link>
      {showBookingLink && (
        <Link href={bookingLink} className={navLinkClass} onClick={() => setOpen(false)}>
          รายการจอง
        </Link>
      )}
      {showBackOffice && (
        <Link href="/admin" className={navLinkClass} onClick={() => setOpen(false)}>
          หลังบ้าน
        </Link>
      )}
      {!isLoggedIn && (
        <Link href="/login" className={navLinkClass} onClick={() => setOpen(false)}>
          เข้าสู่ระบบ
        </Link>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold text-emerald-700 transition-opacity hover:opacity-90 md:text-lg"
        >
          บ้านสวนโฮมสเตย์
        </Link>

        <nav className="hidden items-center gap-6 md:flex md:gap-8">
          {navLinks}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="inline-flex items-center gap-2">
                  <UserCircle2 className="h-4 w-4" />
                  <span className="max-w-[140px] truncate">{profileLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {user?.email || profileLabel}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">ข้อมูลผู้ใช้</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-red-600 focus:text-red-600"
                >
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="default" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/register">สมัครสมาชิก</Link>
            </Button>
          )}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="เปิดเมนู">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle>เมนู</SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-1">
              <Link
                href="/"
                className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                หน้าหลัก
              </Link>
              <Link
                href="/services"
                className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                สินค้าและบริการ
              </Link>
              <Link
                href="/about"
                className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                เกี่ยวกับเรา
              </Link>
              {showBookingLink && (
                <Link
                  href={bookingLink}
                  className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  รายการจอง
                </Link>
              )}
              {showBackOffice && (
                <Link
                  href="/admin"
                  className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  หลังบ้าน
                </Link>
              )}
              {isLoggedIn ? (
                <>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/profile" onClick={() => setOpen(false)}>
                      ข้อมูลผู้ใช้
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      setOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                  >
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/register" onClick={() => setOpen(false)}>
                      สมัครสมาชิก
                    </Link>
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
