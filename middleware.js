export const runtime = 'nodejs';

import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const session = req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes (login required)
  const protectedRoutes = ['/properties/add', '/profile', '/properties/saved', '/messages', '/listings/add'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Admin-only routes
  const adminRoutes = ['/listings/add', '/listings/edit'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isAdminRoute && !session?.user?.isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/properties/add', '/profile', '/properties/saved', '/messages', '/listings/add', '/listings/edit/:path*'],
};


// export const runtime = 'nodejs';

// import { auth } from '@/auth';
// import { NextResponse } from 'next/server';

// export default auth((req) => {
//   const isLoggedIn = !!req.auth;
//   const { pathname } = req.nextUrl;

//   // Protected routes
//   const protectedRoutes = ['/properties/add', '/profile', '/properties/saved', '/messages'];
//   const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

//   if (isProtectedRoute && !isLoggedIn) {
//     return NextResponse.redirect(new URL('/api/auth/signin', req.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ['/properties/add', '/profile', '/properties/saved', '/messages'],
// };