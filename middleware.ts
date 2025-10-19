import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/auth';

// Define which routes are public
const publicPaths = ['/', '/login', '/api/login'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  // 🟢 If user is on a public page and already has a token, redirect to dashboard
  if (publicPaths.includes(pathname)) {
    if (token) {
      try {
        await verifyJwt(token);
        const dashboardUrl = req.nextUrl.clone();
        dashboardUrl.pathname = '/dashboard';
        return NextResponse.redirect(dashboardUrl);
      } catch {
        // invalid token — clear redirect logic
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 🔴 For protected routes — require valid token
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  try {
    await verifyJwt(token);
    return NextResponse.next();
  } catch (err) {
    console.log('Invalid token:', err);
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
}

// Apply middleware to these routes
export const config = {
  matcher: [
    '/', 
    '/login', 
    '/dashboard/:path*',
    '/register/:path*',
    '/chat/:path*',
    '/invoice/:path*',
    '/setting/:path*',
    '/invoiceDetails/:path*',
    '/users/:path*',
    '/api/:path*'
  ],
};
