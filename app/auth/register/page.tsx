/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Registration failed. Please try again."
        );
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "aitp_user",
          JSON.stringify({ name: data.user?.name, email: data.user?.email })
        );
      }

      setMessage("Account created! Redirecting...");
      setMessageType("success");
      setLoading(false);

      setTimeout(() => {
        router.push("/");
      }, 600);
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Unable to register. Please try again.";
      setMessage(errMsg);
      setMessageType("error");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1 bg-linear-to-br from-indigo-50 via-white to-blue-50">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
              Join the community
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Create your travel companion account
            </h1>
            <p className="text-lg text-gray-600">
              Save itineraries, sync preferences, and pick up where you left off
              across devices.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start space-x-3 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mt-1 h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg">
                  ✨
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Smart planning</p>
                  <p className="text-sm text-gray-600">
                    Let AI optimize your routes, stays, and activities.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mt-1 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg">
                  🔒
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Secure storage</p>
                  <p className="text-sm text-gray-600">
                    Your trips and personal details are kept private.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
            <div className="mb-6 space-y-2">
              <p className="text-sm font-medium text-indigo-700">Register</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                Create your account
              </h2>
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Log in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

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
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full justify-center py-3 text-base font-semibold"
              >
                Create account
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
