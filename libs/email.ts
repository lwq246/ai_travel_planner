import crypto from "crypto";
import nodemailer from "nodemailer";

/**
 * Generate a secure random token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  // 1. Setup Base URL
  // const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const baseUrl = 'http://localhost:3000';
  const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;

  // 2. Create the Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 3. Define Email Content
  const mailOptions = {
    from: `"AI Travel Planner" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset for your AI Travel Planner account.</p>
        <p>Click the button below to set a new password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="color: #777; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 11px;">${resetUrl}</p>
      </div>
    `,
  };

  // 4. Send the Email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    throw new Error("Failed to send email");
  }
}