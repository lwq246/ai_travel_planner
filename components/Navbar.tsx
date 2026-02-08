/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type SessionUser = {
  name: string;
  email: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication via API (JWT token in HttpOnly cookie)
    const checkAuth = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Important: include cookies
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            name: data.user.name || "",
            email: data.user.email,
          });
          // Also store in localStorage for backward compatibility
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "aitp_user",
              JSON.stringify({
                name: data.user.name || "",
                email: data.user.email,
              })
            );
          }
        } else {
          setUser(null);
          // Clear localStorage if not authenticated
          if (typeof window !== "undefined") {
            localStorage.removeItem("aitp_user");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("aitp_user");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        e.target instanceof Node &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout API to clear HttpOnly cookie
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // Important: include cookies
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear localStorage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("aitp_user");
      }
      setUser(null);
      setOpen(false);
      router.push("/auth/login");
    }
  };

  const profileInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm relative z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-blue-600">✈️</div>
          <span className="text-xl font-bold text-gray-900">
            AI Travel Planner
          </span>
        </Link>

        {/* Navigation / Profile */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200"></div>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm hover:border-blue-300 hover:shadow"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {profileInitial}
                </span>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white py-2 shadow-lg z-50">
                  <Link
                    href="/saved"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Saved Itineraries
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-md text-sm font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
