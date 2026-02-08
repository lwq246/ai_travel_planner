/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to send reset email. Please try again.");
      }

      setMessage(
        "If an account with that email exists, we've sent a password reset link. Please check your inbox."
      );
      setMessageType("success");
      setSubmitted(true);
      setLoading(false);
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Unable to process request. Please try again.";
      setMessage(errMsg);
      setMessageType("error");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1 bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              Password Recovery
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Reset your password securely
            </h1>
            <p className="text-lg text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
              The link will expire in 1 hour for security.
            </p>
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="flex items-start space-x-3 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mt-1 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg">
                  ✉️
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Check your inbox
                  </p>
                  <p className="text-sm text-gray-600">
                    We'll send password reset instructions to your email address.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mt-1 h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg">
                  🔒
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Secure process
                  </p>
                  <p className="text-sm text-gray-600">
                    Reset links expire after 1 hour for your security.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
            <div className="mb-6 space-y-2">
              <p className="text-sm font-medium text-blue-700">Password Reset</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                {submitted ? "Check your email" : "Enter your email"}
              </h2>
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full justify-center py-3 text-base font-semibold"
                >
                  Send Reset Link
                </Button>

                {message && (
                  <div
                    className={`rounded-lg px-4 py-3 text-sm ${
                      messageType === "error"
                        ? "bg-red-50 text-red-800"
                        : "bg-green-50 text-green-800"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </form>
            ) : (
              <div className="space-y-5">
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
                  {message}
                </div>
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setEmail("");
                      setMessage("");
                    }}
                    className="w-full justify-center py-3 text-base font-semibold"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
