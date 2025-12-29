import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/config/database";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
    });

    return NextResponse.json(
      {
        message: "Account created.",
        user: { name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[REGISTER_POST]", error);

    // Handle duplicate key in case of race conditions
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

