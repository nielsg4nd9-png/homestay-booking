/** @type {import('next').NextConfig} */
const nextConfig = {
  // ลด EPERM บน Windows จากการเขียนไฟล์ .next/trace
  outputFileTracing: false,
}

module.exports = nextConfig
