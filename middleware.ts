import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/auth';

const publicPaths = ['/login', '/register', '/api/login', '/api/register'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicPaths.includes(pathname)) return NextResponse.next();

  const token = req.cookies.get('token')?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  try {
    await verifyJwt(token);
    return NextResponse.next();
  } catch (err) {
    console.log('Token invalid', err);
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/dashboard/:path*' , '/invoice/:path*'], 
};
