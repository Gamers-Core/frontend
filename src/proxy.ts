import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { routing } from './i18n';
import { guestOnlyRoutes, publicRoutes } from './proxy/routes';
import { isLoggedInHeaderKey } from './proxy/const';
import { getIsAllowedPath } from './proxy/helpers';

const intlMiddleware = createMiddleware(routing);

export const proxy = async (req: NextRequest) => {
  const session = req.cookies.get('session')?.value;

  const { pathname: rawPathname } = req.nextUrl;
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})`);
  const pathname = rawPathname.replace(localePattern, '') || '/';

  const isLoggedIn = !!session;
  const isGuestOnlyPath = getIsAllowedPath(pathname, guestOnlyRoutes);
  const isPublicPath = getIsAllowedPath(pathname, publicRoutes);

  if (isGuestOnlyPath && isLoggedIn) return NextResponse.redirect(new URL('/', req.url));

  const isGuestAccessingProtectedRoute = !isGuestOnlyPath && !isPublicPath && !isLoggedIn;
  if (isGuestAccessingProtectedRoute) {
    const newURL = new URL('/login', req.url);

    newURL.searchParams.set('from', encodeURIComponent(pathname + req.nextUrl.search));

    return NextResponse.redirect(newURL);
  }

  const headers = new Headers(req.headers);
  headers.set(isLoggedInHeaderKey, String(isLoggedIn));

  const response = intlMiddleware(new NextRequest(req, { headers }));
  return response;
};

export const config = {
  matcher: ['/((?!api|_next|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
};
