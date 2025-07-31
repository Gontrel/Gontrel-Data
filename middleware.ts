import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('user_token')?.value;

  const publicPaths = ['/', '/forget-password'];
  const isPublicRoute = publicPaths.includes(pathname);

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/restaurants', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
