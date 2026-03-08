/**
 * แสดงเมื่อ deploy แล้วแต่ยังไม่ได้ตั้งค่า Environment Variables
 * ใช้ใน root layout เมื่อตรวจพบว่า DATABASE_URL หรือ NEXTAUTH_SECRET ขาด
 */
export function EnvSetupRequired() {
  return (
    <html lang="th">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6, color: '#1e293b' }}>
        <h1 style={{ color: '#b91c1c', marginBottom: '1rem', fontSize: '1.25rem' }}>
          ยังไม่ได้ตั้งค่า Environment Variables
        </h1>
        <p style={{ marginBottom: '1rem' }}>
          แอปต้องมีตัวแปรต่อไปนี้บนแพลตฟอร์มที่ deploy (Vercel / AWS / อื่นๆ):
        </p>
        <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
          <li><strong>DATABASE_URL</strong> — connection string ของ PostgreSQL</li>
          <li><strong>NEXTAUTH_SECRET</strong> — สร้างด้วย <code style={{ background: '#f1f5f9', padding: '0.2em 0.4em', borderRadius: 4 }}>openssl rand -base64 32</code></li>
          <li><strong>NEXTAUTH_URL</strong> — URL จริงของเว็บ (เช่น https://your-app.vercel.app)</li>
        </ul>
        <p style={{ marginBottom: '1rem' }}>
          ไปที่โปรเจกต์ → <strong>Settings</strong> → <strong>Environment Variables</strong> → เพิ่มตัวแปรด้านบน (เลือก Environment: <strong>Production</strong>) จากนั้น <strong>Redeploy</strong>
        </p>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          ดูรายละเอียดใน repo: <strong>docs/DEPLOY-VERCEL.md</strong>
        </p>
      </body>
    </html>
  )
}
