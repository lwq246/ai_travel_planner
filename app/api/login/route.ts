import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/config/database";
import { generateToken } from "@/libs/jwt";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).lean();

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const hashedPassword = user.password;
    let valid = false;

    // Prefer bcrypt comparison; if hashing fails (plain text stored), fall back to direct match
    try {
      valid = await bcrypt.compare(password, hashedPassword);
    } catch {
      valid = password === hashedPassword;
    }

    if (!valid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    // Create response with user data
    const response = NextResponse.json(
      {
        message: "Login successful.",
        user: {
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // Set HttpOnly cookie with JWT token
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set("aitp_token", token, {
      httpOnly: true,
      secure: isProduction, // Only send over HTTPS in production
      sameSite: "lax", // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_POST]", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

