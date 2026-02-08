import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/libs/jwt";

/**
 * GET /api/auth/me
 * Returns the current authenticated user based on JWT token in cookies
 */
export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("[AUTH_ME_GET]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
