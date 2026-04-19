import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('kademe_token')?.value;
  const rolesJson = request.cookies.get('user_roles')?.value;
  const roles = rolesJson ? JSON.parse(rolesJson) : [];
  
  const { pathname } = request.nextUrl;

  // 1. Dashboard Koruması
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // 2. Rol Bazlı Dashboard Kısıtlamaları
    if (pathname.startsWith('/dashboard/admin')) {
      if (!roles.includes('super-admin') && !roles.includes('coordinator')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    if (pathname.startsWith('/dashboard/alumni')) {
      if (!roles.includes('alumni') && !roles.includes('super-admin')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // 3. Login/Register sayfasına gidişi engelle (zaten login ise)
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
