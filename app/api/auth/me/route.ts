// /app/api/auth/me/route.ts
import { getAuthenticatedUser } from "@/libs/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);

    if (!user) {
      // CHANGE: Return 200 status, but with user as null
      return NextResponse.json(
        { user: null }, 
        { status: 200 }
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