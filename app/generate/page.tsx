"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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

interface ItineraryResponse {
  days: Day[];
}

export default function GeneratePage() {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [days, setDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState("relaxed");
  const [budgetLevel, setBudgetLevel] = useState("moderate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country,
          days,
          travelStyle,
          budgetLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate itinerary");
      }

      // Store itinerary data with metadata for results page
      const itineraryData = {
        ...data,
        country,
        duration: days,
        travelStyle,
        budgetLevel,
      };

      // Save to localStorage for results page
      localStorage.setItem("last_itinerary", JSON.stringify(itineraryData));

      // Navigate to results page
      router.push("/results");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Generate Your Itinerary
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Tell us about your dream trip and let AI create a personalized
                itinerary for you.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country / Destination
                  </label>
                  <input
                    id="country"
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="e.g., Japan, France, Italy"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="days"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of Days
                  </label>
                  <input
                    id="days"
                    type="number"
                    required
                    min="1"
                    max="30"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 3)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="travelStyle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Travel Style
                  </label>
                  <select
                    id="travelStyle"
                    required
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="relaxed">Relaxed</option>
                    <option value="moderate">Moderate</option>
                    <option value="adventurous">Adventurous</option>
                    <option value="luxury">Luxury</option>
                    <option value="budget">Budget</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="budgetLevel"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Budget Level
                  </label>
                  <select
                    id="budgetLevel"
                    required
                    value={budgetLevel}
                    onChange={(e) => setBudgetLevel(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="budget">Budget</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                  className="w-full justify-center py-3 text-base font-semibold"
                >
                  {loading ? "Generating Itinerary..." : "Generate Itinerary"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
