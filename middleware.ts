// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest) => {
  // if user is logged in, token will exist
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;
  // allow req if (1) token exists
  // or (2) its a req for NEXTAUTH Session and provider
  // or (3) its a req tp '/_NEXT/' (/_next/static)
  if (token || pathname.includes("/api/auth") || pathname.includes("/_next")) {
    if (pathname == "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
  // Redirect to login
  // (1) user doesnt have a token and
  // (2) is requesting protected route
  if (!token && pathname != "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
};
