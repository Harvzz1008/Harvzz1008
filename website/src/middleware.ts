import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const COOKIE_NAME = 'auth-token'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookie
  const token = request.cookies.get(COOKIE_NAME)?.value
  const session = token ? await verifyToken(token) : null

  // Protect /admin routes - require ADMIN role
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login?redirect=/admin', request.url))
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Protect /account routes - require any authenticated user
  if (pathname.startsWith('/account')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login?redirect=/account', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
