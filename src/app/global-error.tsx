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

  return (
    <html lang="th">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
        <h1 style={{ color: '#b91c1c', marginBottom: '1rem' }}>
          {showEnvHelp ? 'ยังไม่ได้ตั้งค่า Environment Variables' : 'เกิดข้อผิดพลาด'}
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
