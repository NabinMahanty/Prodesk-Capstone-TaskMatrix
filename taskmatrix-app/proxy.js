import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];

/**
 * Route protection proxy (replaces middleware in Next.js 16).
 * Redirects unauthenticated users away from protected routes.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow public paths and Next.js internals
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Check session cookie set by AuthProvider
  const token = request.cookies.get('taskmatrix_auth_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
