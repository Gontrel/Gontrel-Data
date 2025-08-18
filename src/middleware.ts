import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Routes that do not require authentication
  const isPublicPath = [
    "/",
    "/forget-password",
    "/reset-password",
    "/health",
  ]?.includes(path);

  const token = request.cookies.get("user_token")?.value || "";

  // If the user is authenticated and tries to access a public path, they are redirected to the dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/restaurants", request?.url));
  }

  // If the user is not authenticated and tries to access a protected path, they are redirected to the login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request?.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
