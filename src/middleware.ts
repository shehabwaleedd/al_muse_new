// middleware.ts (in your Next.js application root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get('token')?.value;
    console.log('middleware', { pathname, token })

    // Redirect authenticated users away from login and register pages
    if (token && (pathname === '/login' || pathname === '/register')) {
        const url = req.nextUrl.clone();
        url.pathname = '/'; // Redirect to home page if already logged in
        return NextResponse.redirect(url);
    }

    // Redirect unauthenticated users trying to access restricted paths
    if (!token && pathname.startsWith('/account')) {
        const url = req.nextUrl.clone();
        url.pathname = '/login'; // Redirect to login page if not logged in
        return NextResponse.redirect(url);
    }

    // Pass through for all other cases
    return NextResponse.next();
}

export const config = {
    matcher: ['/account/:path*', '/login', '/register']  // Apply middleware to these paths
};