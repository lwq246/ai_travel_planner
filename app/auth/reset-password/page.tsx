/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [token, setToken] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setMessage("Invalid or missing reset token. Please request a new password reset.");
      setMessageType("error");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setMessageType("error");
      return;
    }

    if (!token) {
      setMessage("Invalid reset token. Please request a new password reset.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to reset password. Please try again.");
      }

      setMessage("Password reset successfully! Redirecting to login...");
      setMessageType("success");
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Unable to reset password. Please try again.";
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
              Password Reset
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Create a new password
            </h1>
            <p className="text-lg text-gray-600">
              Choose a strong password to secure your account. Make sure it's at least 8 characters long.
            </p>
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="flex items-start space-x-3 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mt-1 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg">
                  🔐
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Strong password
                  </p>
                  <p className="text-sm text-gray-600">
                    Use a combination of letters, numbers, and special characters.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mt-1 h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Secure account
                  </p>
                  <p className="text-sm text-gray-600">
                    Your new password will be encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
            <div className="mb-6 space-y-2">
              <p className="text-sm font-medium text-blue-700">New Password</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                {success ? "Password Reset!" : "Set your new password"}
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

            {success ? (
              <div className="space-y-5">
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
                  {message}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    minLength={8}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={!token}
                  className="w-full justify-center py-3 text-base font-semibold"
                >
                  Reset Password
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
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
