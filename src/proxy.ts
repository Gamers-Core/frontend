import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { Locale } from 'next-intl';

import { defaultLocale, routing } from './i18n';
import { guestOnlyRoutes, publicRoutes } from './proxy/routes';
import { isLoggedInHeaderKey } from './proxy/const';
import { getIsAllowedPath } from './proxy/helpers';

const intlMiddleware = createMiddleware(routing);

const proxy = async (req: NextRequest) => {
  const session = req.cookies.get('session')?.value;
  const sessionSig = req.cookies.get('session.sig')?.value;
  const isLoggedIn = req.cookies.get('x-is-logged-in')?.value === 'true' || (session && sessionSig);

  const { pathname: rawPathname } = req.nextUrl;
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})`);
  const pathname = rawPathname.replace(localePattern, '') || '/';

  const isGuestOnlyPath = getIsAllowedPath(pathname, guestOnlyRoutes);
  const isPublicPath = getIsAllowedPath(pathname, publicRoutes);

  if (isGuestOnlyPath && isLoggedIn) return NextResponse.redirect(new URL('/', req.url));

  const isGuestAccessingProtectedRoute = !isGuestOnlyPath && !isPublicPath && !isLoggedIn;
  if (isGuestAccessingProtectedRoute) {
    const newURL = new URL('/signin', req.url);

    newURL.searchParams.set('from', pathname + req.nextUrl.search);

    return NextResponse.redirect(newURL);
  }

  const headers = new Headers(req.headers);
  headers.set(isLoggedInHeaderKey, String(isLoggedIn));
  headers.set('x-pathname', req.nextUrl.pathname);

  const localeMatch = rawPathname.match(localePattern) as RegExpMatchArray | [null];
  const locale = (localeMatch?.[1] as Locale) || defaultLocale;
  const appLocale = req.cookies.get('NEXT_LOCALE')?.value || locale;
  const backendLocale = req.cookies.get('x-locale')?.value;

  const alreadyOnCorrectLocale = rawPathname.startsWith(`/${backendLocale}`);
  if (isLoggedIn && backendLocale && backendLocale !== appLocale && !alreadyOnCorrectLocale)
    return NextResponse.redirect(new URL(`/${backendLocale}${pathname}`, req.url));

  return intlMiddleware(new NextRequest(req, { headers }));
};

export default proxy;

export const config = {
  matcher: ['/((?!api|_next|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
};
