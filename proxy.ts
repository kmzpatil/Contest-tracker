import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

function getKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  const isAuthPage = path === '/login' || path === '/register';
  const isProtected = path.startsWith('/dashboard') ||
                      path.startsWith('/calendar') ||
                      path.startsWith('/alarms') ||
                      path.startsWith('/profile') ||
                      path.startsWith('/stats') ||
                      path.startsWith('/settings');

  if (isProtected) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      await jwtVerify(session, getKey(), { algorithms: ['HS256'] });
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (isAuthPage && session) {
    try {
      await jwtVerify(session, getKey(), { algorithms: ['HS256'] });
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch {
      // invalid session, let them see auth page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/calendar/:path*', '/alarms/:path*', '/profile/:path*', '/stats/:path*', '/settings/:path*', '/login', '/register'],
};
