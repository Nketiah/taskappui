import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Check for correct cookie name: authToken
  const token = req.cookies.get('authToken')?.value;

  // Redirect to home if no token and trying to access /dashboard routes
    if (!token && (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname === '/viewTask'
  )) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Allow access otherwise
  return NextResponse.next();
}

// Apply middleware only to dashboard routes and subpaths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/invite',
    '/task',
    '/viewTask',
    '/AllTeams',
  ],
};

