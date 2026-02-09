"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface Activity {
  name: string;
  description: string;
  lat: number;
  lng: number;
  time: string;
  estimatedCost: number;
  travelTimeMinutes: number;
}

interface Day {
  day: number;
  city: string;
  activities: Activity[];
}

interface SavedItinerary {
  _id: string;
  country: string;
  duration: number;
  travelStyle: string;
  budgetLevel: string;
  days: Day[];
  savedAt: string;
  name?: string;
}

export default function SavedPage() {
  const router = useRouter();
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedItineraries();
  }, []);

  const loadSavedItineraries = async () => {
    try {
      // Get user email from localStorage
      const userStr = localStorage.getItem("aitp_user");
      if (!userStr) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const email = user.email;

      const response = await fetch(
        `/api/itineraries?email=${encodeURIComponent(email)}`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch itineraries");
      }

      const itineraries = await response.json();
      setSavedItineraries(itineraries);
    } catch (e: any) {
      console.error("Failed to load saved itineraries", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this itinerary?")) {
      return;
    }

    try {
      // Get user email from localStorage
      const userStr = localStorage.getItem("aitp_user");
      if (!userStr) {
        alert("Please log in to delete itineraries.");
        return;
      }

      const user = JSON.parse(userStr);
      const email = user.email;

      const response = await fetch(
        `/api/itineraries/${id}?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete itinerary");
      }

      // Remove from local state
      setSavedItineraries(savedItineraries.filter((it) => it._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete itinerary. Please try again.");
    }
  };

  const handleView = (itinerary: SavedItinerary) => {
    // Convert MongoDB format to results page format
    const itineraryData = {
      days: itinerary.days,
      country: itinerary.country,
      duration: itinerary.duration,
      travelStyle: itinerary.travelStyle,
      budgetLevel: itinerary.budgetLevel,
    };

    // Save as last_itinerary and navigate to results page
    localStorage.setItem("last_itinerary", JSON.stringify(itineraryData));
    router.push("/results");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalCost = (itinerary: SavedItinerary) => {
    return itinerary.days.reduce((total, day) => {
      return (
        total +
        day.activities.reduce((dayTotal, activity) => {
          return dayTotal + (activity.estimatedCost || 0);
        }, 0)
      );
    }, 0);
  };

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading saved itineraries...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Saved Itineraries
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Access and manage all your saved travel plans
            </p>
          </div>

          {savedItineraries.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-lg ring-1 ring-gray-100">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                No saved itineraries yet
              </h3>
              <p className="mt-2 text-gray-600">
                Start planning your trip and save your favorite itineraries
                here.
              </p>
              <div className="mt-6">
                <Button href="/generate" variant="primary">
                  Create Your First Itinerary
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedItineraries.map((itinerary) => (
                <div
                  key={itinerary._id}
                  className="group rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 transition-all hover:shadow-xl hover:ring-blue-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {itinerary.name || `${itinerary.country} Trip`}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {itinerary.country}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(itinerary._id)}
                      className="ml-2 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete itinerary"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {itinerary.duration} days
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {itinerary.travelStyle}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {itinerary.budgetLevel} •{" "}
                      {formatCurrency(calculateTotalCost(itinerary))}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg
                        className="mr-2 h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Saved {formatDate(itinerary.savedAt)}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button
                      onClick={() => handleView(itinerary)}
                      variant="primary"
                      className="text-sm flex-1"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/generate" variant="primary">
              Generate New Itinerary
            </Button>
            <Button href="/" variant="secondary">
              Back to Home
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
