import path from 'node:path'
import { readFileSync, existsSync } from 'node:fs'
import { defineConfig } from 'prisma/config'

// โหลด .env เมื่อมี prisma.config.ts (Prisma จะไม่โหลด .env เอง)
const envPath = path.join(process.cwd(), '.env')
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/)
    if (m) {
      const key = m[1].trim()
      const value = m[2].trim().replace(/^["']|["']$/g, '')
      process.env[key] = value
    }
  }
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'npx ts-node -P tsconfig.seed.json prisma/seed.ts',
  },
})
