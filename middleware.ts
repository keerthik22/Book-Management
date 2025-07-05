import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value;
  
  if (request.nextUrl.pathname.startsWith('/api/') && userId) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};