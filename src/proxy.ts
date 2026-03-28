import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
};
