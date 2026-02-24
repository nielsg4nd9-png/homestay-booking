import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { Role } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role } = body as {
      name?: string
      email?: string
      password?: string
      role?: Role
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'email และ password จำเป็น' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'อีเมลนี้มีผู้ใช้งานแล้ว' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const userCount = await prisma.user.count()
    const finalRole: Role = role ?? (userCount === 0 ? 'ADMIN' : 'USER')

    const user = await prisma.user.create({
      data: {
        name: name ?? null,
        email,
        password: hashed,
        role: finalRole,
      },
    })

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      { status: 201 },
    )
  } catch (e) {
    return NextResponse.json({ error: 'ไม่สามารถสร้างผู้ใช้ได้' }, { status: 500 })
  }
}

