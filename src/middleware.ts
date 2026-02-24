import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const isLoggedIn = !!token
      const pathname = req.nextUrl.pathname
      if (!isLoggedIn) return false

      // เส้นทาง /admin ให้เฉพาะ ADMIN และ EMPLOYEE
      if (pathname.startsWith('/admin')) {
        const role = (token?.role as string) ?? 'USER'
        return role === 'ADMIN' || role === 'EMPLOYEE'
      }

      return true
    },
  },
})

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}

