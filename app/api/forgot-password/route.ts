import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/config/database";
import { generateResetToken, sendPasswordResetEmail } from "@/libs/email";
import User from "@/models/User";

// 1. Strict Validation Schema
const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .transform(val => val.trim().toLowerCase()) // still normalize
    .pipe(z.email({ message: "Please provide a valid email address" })), // new preferred way
});


export async function POST(req: NextRequest) {
  try {
    // 2. Parse Body
    // Using explicit try-catch for JSON parsing in case body is empty/malformed
    let body;
    try {
      body = await req.json();
    } catch (e) {
       return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // 3. Validate Input
    const validation = ForgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      const errorMessages = validation.error.issues.map((err) => err.message);
      return NextResponse.json(
        { message: errorMessages[0], errors: errorMessages },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    await connectDB();

    // 4. Find User
    const user = await User.findOne({ email });

    // 5. Logic: Handle "User Exists"
    if (user) {
      // Generate secure token
      const resetToken = generateResetToken();
      
      // Set expiration (1 hour)
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

      // Save to Database
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();

      // Send Email
      try {
        await sendPasswordResetEmail(email, resetToken);
      } catch (emailError) {
        // Critical: Log this error on the server so you know if emails are failing
        console.error("[FORGOT_PASSWORD] Email service failed:", emailError);
        
        // Optional: If email is critical, you COULD return 500 here.
        // However, for security, we usually proceed as if it worked 
        // to prevent users from knowing if the email system failed for a specific account.
      }
    }

    // 6. Response (Security Best Practice)
    // Always return 200 OK. This prevents "Email Enumeration" attacks 
    // (hackers checking if an email exists in your DB based on the error message).
    return NextResponse.json(
      {
        message: "If an account with that email exists, we've sent a password reset link.",
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("[FORGOT_PASSWORD_POST]", error);

    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}