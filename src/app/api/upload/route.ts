import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'ไม่พบไฟล์ที่อัปโหลด' }, { status: 400 })
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: 'รองรับเฉพาะไฟล์รูปภาพ jpg, png, webp, gif' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'รูปภาพต้องมีขนาดไม่เกิน 2MB' }, { status: 400 })
    }

    const ext = ALLOWED_TYPES[file.type]
    const fileName = `${Date.now()}-${randomUUID()}.${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    return NextResponse.json({ url: `/uploads/${fileName}` })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'อัปโหลดรูปไม่สำเร็จ' }, { status: 500 })
  }
}

