'use client'

import { useEffect } from 'react'

function isEnvConfigError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  const code = error && typeof error === 'object' && 'code' in error ? (error as { code?: string }).code : ''
  return (
    code === 'NO_SECRET' ||
    /NEXTAUTH_SECRET|define a [`']secret[`']/i.test(msg) ||
    /Environment variable not found: DATABASE_URL/i.test(msg) ||
    /DATABASE_URL/i.test(msg)
  )
}

function isDbReachError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  const code = error && typeof error === 'object' && 'code' in error ? (error as { code?: string }).code : ''
  return (
    code === 'P1000' ||
    /Authentication failed|credentials.*not valid/i.test(msg) ||
    /reach database server|connect to database/i.test(msg)
  )
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  const showEnvHelp = isEnvConfigError(error)
  const showDbReachHelp = isDbReachError(error)
  const isAuthError =
    error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P1000'

  return (
    <html lang="th">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
        <h1 style={{ color: '#b91c1c', marginBottom: '1rem' }}>
          {showEnvHelp ? 'ยังไม่ได้ตั้งค่า Environment Variables' : showDbReachHelp ? 'เชื่อมต่อฐานข้อมูลไม่ได้' : 'เกิดข้อผิดพลาด'}
        </h1>
        {showEnvHelp ? (
          <>
            <p style={{ marginBottom: '1rem' }}>
              แอปต้องมีตัวแปรสภาพแวดล้อมต่อไปนี้บนแพลตฟอร์มที่ deploy (Vercel / AWS / อื่นๆ):
            </p>
            <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
              <li><strong>DATABASE_URL</strong> — connection string ของ PostgreSQL</li>
              <li><strong>NEXTAUTH_SECRET</strong> — สร้างด้วยคำสั่ง <code style={{ background: '#f1f5f9', padding: '0.2em 0.4em', borderRadius: 4 }}>openssl rand -base64 32</code></li>
              <li><strong>NEXTAUTH_URL</strong> — URL จริงของเว็บ (เช่น https://your-app.vercel.app)</li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>
              ไปที่โปรเจกต์ใน Vercel/AWS → <strong>Settings</strong> → <strong>Environment Variables</strong> แล้วเพิ่มตัวแปรด้านบน (เลือก Environment: Production) จากนั้น <strong>Redeploy</strong>
            </p>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              ดูรายละเอียดใน repo: <strong>docs/DEPLOY-VERCEL.md</strong>
            </p>
          </>
        ) : showDbReachHelp ? (
          <>
            {isAuthError ? (
              <>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>Authentication failed (P1000)</strong> — รหัสผ่านหรือ user ใน <strong>DATABASE_URL</strong> ไม่ถูกต้อง
                </p>
                <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                  <li>ไปที่ Neon Console → โปรเจกต์ → <strong>Connection string</strong> แล้วคัดลอกใหม่ (ใช้ Pooler)</li>
                  <li>ถ้ารหัสผ่านมีอักขระพิเศษ (เช่น <code style={{ background: '#f1f5f9', padding: '0.2em 0.4em', borderRadius: 4 }}>@ # : / ?</code>) ต้อง <strong>URL-encode</strong> (เช่น <code style={{ background: '#f1f5f9', padding: '0.2em 0.4em', borderRadius: 4 }}>@</code> → <code style={{ background: '#f1f5f9', padding: '0.2em 0.4em', borderRadius: 4 }}>%40</code>)</li>
                  <li>อัปเดต <strong>DATABASE_URL</strong> ใน Vercel/AWS → Environment Variables แล้ว <strong>Redeploy</strong></li>
                </ul>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '1rem' }}>
                  Serverless (Vercel/AWS Lambda) เชื่อมต่อ Postgres ไม่ได้ มักเกิดกับ <strong>Neon</strong> ถ้าใช้ Neon ให้แก้ <strong>DATABASE_URL</strong> ดังนี้:
                </p>
                <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                  <li>ใช้ connection แบบ <strong>Pooler</strong> (host มี <code style={{ background: '#f1f5f9', padding: '0.2em 0.4em', borderRadius: 4 }}>-pooler</code>)</li>
                  <li>ต่อท้าย URL ด้วย <code style={{ background: '#f1f5f9', padding: '0.2em 0.4em', borderRadius: 4 }}>?sslmode=require&amp;connect_timeout=15</code></li>
                </ul>
                <p style={{ marginBottom: '1rem' }}>
                  ตัวอย่าง: <code style={{ background: '#f1f5f9', padding: '0.2em 0.4em', borderRadius: 4, fontSize: '0.875rem', wordBreak: 'break-all' }}>postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require&amp;connect_timeout=15</code>
                </p>
              </>
            )}
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              ดูรายละเอียดใน repo: <strong>docs/DEPLOY-VERCEL.md</strong>
            </p>
          </>
        ) : (
          <p style={{ marginBottom: '1rem' }}>เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแล</p>
        )}
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '0.5rem 1rem',
            background: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          ลองใหม่
        </button>
      </body>
    </html>
  )
}
