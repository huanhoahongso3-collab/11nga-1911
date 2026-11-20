import { NextResponse } from 'next/server';
import { hasTraversal, isBlockedPath, isSameOrigin, isScanner } from './lib/guard';

const deny = (status) => new NextResponse(null, { status, headers: { 'Cache-Control': 'no-store' } });

// Runs before every page and API request. Static files and public images are excluded by the matcher below.
export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (isScanner(request.headers.get('user-agent'))) return deny(403);
  if (hasTraversal(request.url)) return deny(400);
  if (isBlockedPath(pathname)) return deny(404);

  if (pathname.startsWith('/api/')) {
    if (request.method !== 'POST') return deny(405);
    if (!isSameOrigin(request)) return deny(403);
    return NextResponse.next();
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') return deny(405);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|stickers/|guess/|compare/|credits/|favicon.ico).*)'],
};
