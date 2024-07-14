import {
  withMiddlewareAuthRequired,
  getSession,
} from '@auth0/nextjs-auth0/edge';
import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/config';

enum Role {
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
}

export default withMiddlewareAuthRequired(async function middleware(
  req: NextRequest,
) {
  const res = NextResponse.next();
  const session = await getSession(req, res);
  const path = req.nextUrl.pathname;

  const userRoles = session?.user[`${env.AUTH0_CUSTOM_CLAIMS_URI}/roles`] || [];

  if (path.startsWith('/admin') && !userRoles.includes(Role.INSTRUCTOR)) {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (path.startsWith('/app') && !userRoles.includes(Role.STUDENT)) {
    if (userRoles.includes(Role.INSTRUCTOR)) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
});

export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
};
