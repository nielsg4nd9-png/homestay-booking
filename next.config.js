/** @type {import('next').NextConfig} */
const nextConfig = {
  // ลด EPERM บน Windows จากการเขียนไฟล์ .next/trace
  outputFileTracing: false,
  // สำหรับ Docker / deploy: build แบบ standalone ลดขนาดและรันด้วย node server.js
  ...(process.env.DOCKER_BUILD === '1' ? { output: 'standalone' } : {}),
}

module.exports = nextConfig
