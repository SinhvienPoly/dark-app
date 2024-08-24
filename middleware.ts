import NextAuth from 'next-auth';
import authConfig from './auth.config';

import { apiAuthPrefix, DEFAULT_LOGIN_REDIRECT, publicRoutes, authRoutes } from './routes';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth(async (req): Promise<any> => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    console.log('LOGGEDIN', isLoggedIn);

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoutes) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return null;
    }

    if (!isLoggedIn && !isPublicRoutes) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
