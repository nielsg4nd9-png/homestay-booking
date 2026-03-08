/** @type {import('next').NextConfig} */
const nextConfig = {
  // ต้องไม่ปิด outputFileTracing — serverless runtime (Vercel/AWS/OpenNext) ต้องมีไฟล์
  // .next/server/app/*_client-reference-manifest.js ถึงจะโหลดหน้าได้
  // สำหรับ Docker / deploy: build แบบ standalone ลดขนาดและรันด้วย node server.js
  ...(process.env.DOCKER_BUILD === '1' ? { output: 'standalone' } : {}),
}

module.exports = nextConfig
