import {
  withMiddlewareAuthRequired,
  getSession,
} from '@auth0/nextjs-auth0/edge';
import { NextRequest, NextResponse } from 'next/server';

import { UserRole, UserMetadata } from '@/types/auth';
import { env } from '@/lib/config';

const isAdmin = (userRoles: string[]) => {
  return userRoles.includes(UserRole.INSTRUCTOR);
};

const isStudent = (userRoles: string[]) => {
  return userRoles.includes(UserRole.STUDENT);
};

export default withMiddlewareAuthRequired(async function middleware(
  req: NextRequest,
) {
  const res = NextResponse.next();
  const session = await getSession(req, res);
  const path = req.nextUrl.pathname;

  const userRoles = session?.user[`${env.AUTH0_NAMESPACE}/roles`] || [];
  const userMetadata = session?.user[`${env.AUTH0_NAMESPACE}/user_metadata`] as
    | UserMetadata
    | undefined;

  if (
    !userMetadata ||
    !userMetadata.first_name ||
    !userMetadata.last_name ||
    !userMetadata.phone_number
  ) {
    if (path !== '/app/complete-profile') {
      return NextResponse.redirect(new URL('/app/complete-profile', req.url));
    }
  }

  if (path.startsWith('/admin') && !isAdmin(userRoles)) {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (path.startsWith('/app') && !isStudent(userRoles)) {
    if (userRoles.includes(UserRole.INSTRUCTOR)) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
});

export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
};
