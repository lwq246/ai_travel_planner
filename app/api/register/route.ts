import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"; // Import Zod

import connectDB from "@/config/database";
import User from "@/models/User";

// 1. Define a Validation Schema
const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),
  email: z
    .email({ message: "Please provide a valid email address" }) 
    .trim()
    .toLowerCase(), // Zod can handle normalization
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long")
    // Optional: Add regex for complexity (e.g., must have number)
    // .regex(/[0-9]/, "Password must contain at least one number")
});

export async function POST(req: NextRequest) {
  try {
    // 2. Parse JSON safely
    // If the body is malformed JSON, this catch block handles it automatically
    const body = await req.json();

    // 3. Validate Inputs against Schema
    const validation = RegisterSchema.safeParse(body);

    if (!validation.success) {
      // Return specific validation errors to the client
      // Change .errors to .issues
      const errorMessages = validation.error.issues.map((err) => err.message);
      return NextResponse.json(
        { message: errorMessages[0], errors: errorMessages }, 
        { status: 400 }
      );
    }

    // Extract valid data
    const { name, email, password } = validation.data;

    await connectDB();

    // 4. Check for existing user (Logical Check)
    // Using .lean() is good for performance since we don't need a Mongoose document
    const existing = await User.findOne({ email }).select("_id").lean();
    
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // 5. Hash Password
    const hashed = await bcrypt.hash(password, 10);

    // 6. Create User
    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    // 7. Return Success (Sanitized response - never return the password)
    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("[REGISTER_POST]", error);

    // 8. Handle Race Condition (Database Level Constraint)
    // If two requests hit at the exact same millisecond, this catches it.
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}