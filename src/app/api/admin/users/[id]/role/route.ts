import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import type { Role } from '@/lib/auth'
import { ROLES } from '@/lib/auth'

type RouteParams = {
  params: {
    id: string
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await req.json()) as { role?: Role }
  const role = body.role

  if (!role || !ROLES.includes(role)) {
    return NextResponse.json({ error: 'role ไม่ถูกต้อง' }, { status: 400 })
  }

  try {
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role },
    })

    return NextResponse.json({ id: user.id, role: user.role as Role })
  } catch {
    return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 })
  }
}

