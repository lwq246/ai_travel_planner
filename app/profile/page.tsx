/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type SessionUser = {
  name: string;
  email: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("aitp_user");
    if (!stored) {
      router.replace("/auth/login");
      return;
    }

    try {
      setUser(JSON.parse(stored));
    } catch {
      setUser(null);
      router.replace("/auth/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("aitp_user");
    }
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500">Loading profile...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials =
    user.name?.trim()?.charAt(0)?.toUpperCase() ||
    user.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white">
                  {initials}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                Manage your account information and explore your saved trips.
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700"
                >
                  Back to home
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="w-full lg:w-80">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <h3 className="text-base font-semibold text-gray-900">
                  Quick tips
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li>Use the navbar profile menu to jump back here anytime.</li>
                  <li>Log out to switch accounts or keep things private.</li>
                  <li>Explore the home page to start a new trip plan.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

