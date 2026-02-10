/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed. Please try again.");
      }

      if (typeof window !== "undefined") {
        // Store user data (token is stored in HttpOnly cookie automatically)
        localStorage.setItem(
          "aitp_user",
          JSON.stringify({ name: data.user?.name, email: data.user?.email }),
        );
      }

      setMessage(
        `Welcome back, ${data.user?.name || "traveler"}! Redirecting...`,
      );
      setMessageType("success");
      setLoading(false);

      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.";
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
              Secure Access
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Welcome back to your AI-powered travel dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Sign in to create, save, and refine itineraries with real-time
              updates. Your next adventure is a few clicks away.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start space-x-3 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mt-1 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Personalized planning
                  </p>
                  <p className="text-sm text-gray-600">
                    Pick up where you left off and keep refining your trips.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mt-1 h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg">
                  🔒
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Secure by design
                  </p>
                  <p className="text-sm text-gray-600">
                    Your saved trips and preferences stay private to you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
            <div className="mb-6 space-y-2">
              <p className="text-sm font-medium text-blue-700">Log in</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                Access your account
              </h2>
              <p className="text-sm text-gray-600">
                New here?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Create an account
                </Link>
              </p>
            </div>

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

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full justify-center py-3 text-base font-semibold"
              >
                Sign In
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
