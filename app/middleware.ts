import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Check token cookie (adjust cookie name if different)
  const token = req.cookies.get('token')?.value;

  // Redirect to home if no token and trying to access /dashboard routes
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Allow access otherwise
  return NextResponse.next();
}

// Apply middleware only to dashboard routes and subpaths
export const config = {
  matcher: ['/dashboard/:path*'],
};
