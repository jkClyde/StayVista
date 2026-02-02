import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes
  const protectedRoutes = ['/properties/add', '/profile', '/properties/saved', '/messages'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/properties/add', '/profile', '/properties/saved', '/messages'],
};