import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

// JWT secret - must match the one in libs/jwt.ts
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
);
const COOKIE_NAME = "aitp_token";

// Protected routes that require authentication
const protectedRoutes = [
  "/profile",
  "/saved",
  "/generate",
  "/results",
];

// Protected API routes that require authentication
const protectedApiRoutes = [
  "/api/itineraries",
  "/api/generate-itinerary",
  "/api/generate-activity",
  "/api/generate-city",
];

// Public routes that should be accessible without authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
];

// Public API routes
const publicApiRoutes = [
  "/api/login",
  "/api/register",
  "/api/logout",
];

/**
 * Verify JWT token using jose (Edge-compatible)
 * @returns true if token is valid, false otherwise
 */
async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get user payload from JWT token (Edge-compatible)
 * @returns User payload or null if invalid
 */
async function getUserFromToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string | undefined,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if a path matches any of the patterns in the routes array
 */
function isRouteMatch(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match
    if (pathname === route) return true;
    // Prefix match for API routes (e.g., /api/itineraries/123)
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isRouteMatch(pathname, publicRoutes) || isRouteMatch(pathname, publicApiRoutes)) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = isRouteMatch(pathname, protectedRoutes);
  const isProtectedApiRoute = isRouteMatch(pathname, protectedApiRoutes);

  if (!isProtectedRoute && !isProtectedApiRoute) {
    // Not a protected route, allow access
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    // No token found
    if (isProtectedApiRoute) {
      // For API routes, return 401 Unauthorized
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    } else {
      // For page routes, redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Verify token
  const isValid = await verifyToken(token);

  if (!isValid) {
    // Invalid token - clear the cookie
    const response = isProtectedApiRoute
      ? NextResponse.json(
          { error: "Invalid or expired token. Please log in again." },
          { status: 401 }
        )
      : NextResponse.redirect(
          new URL("/auth/login", request.url).toString() +
            `?redirect=${encodeURIComponent(pathname)}`
        );

    // Clear invalid cookie
    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  }

  // Token is valid, allow access
  // Optionally, you can add user info to request headers for API routes
  if (isProtectedApiRoute) {
    const user = await getUserFromToken(token);
    if (user) {
      const response = NextResponse.next();
      // Add user info to headers (optional, for API routes to access)
      response.headers.set("x-user-id", user.userId);
      response.headers.set("x-user-email", user.email);
      if (user.name) {
        response.headers.set("x-user-name", user.name);
      }
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
