/**
 * เลือก schema ตาม DATABASE_URL / VERCEL:
 * - DATABASE_URL ขึ้นต้นด้วย postgresql:// หรือ postgres:// หรือ VERCEL=1 → ใช้ PostgreSQL
 * - นอกนั้น → ใช้ SQLite
 * ใช้ได้ทั้ง local และ deploy (สลับได้โดยแก้ .env แล้วรัน npm install)
 */
const fs = require('fs')
const path = require('path')

// โหลด .env ถ้ามี (postinstall ไม่โหลดให้)
const envPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/)
    if (m && (m[1].trim() === 'DATABASE_URL' || m[1].trim() === 'VERCEL')) {
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
    }
  }
}

const prismaDir = path.join(__dirname, '..', 'prisma')
const schemaPath = path.join(prismaDir, 'schema.prisma')
const postgresPath = path.join(prismaDir, 'schema.postgres.prisma')
const sqlitePath = path.join(prismaDir, 'schema.sqlite.prisma')

const url = (process.env.DATABASE_URL || '').trim()
const usePostgres =
  process.env.VERCEL === '1' ||
  url.startsWith('postgresql://') ||
  url.startsWith('postgres://')

if (usePostgres && fs.existsSync(postgresPath)) {
  fs.copyFileSync(postgresPath, schemaPath)
  console.log('[prisma-schema-select] Using PostgreSQL schema')
} else if (fs.existsSync(sqlitePath)) {
  fs.copyFileSync(sqlitePath, schemaPath)
  console.log('[prisma-schema-select] Using SQLite schema')
}
