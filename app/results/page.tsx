"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";

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

interface ItineraryData {
  days: Day[];
  country: string;
  duration: number;
  travelStyle: string;
  budgetLevel: string;
}

interface SavedItinerary extends ItineraryData {
  id: string;
  savedAt: string;
  name?: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ItineraryData | null>(null);
  const [regeneratingActivity, setRegeneratingActivity] = useState<
    string | null
  >(null);
  const [regeneratingCity, setRegeneratingCity] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  useEffect(() => {
    // Try to get itinerary from localStorage first
    const stored = localStorage.getItem("last_itinerary");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setItineraryData(data);
        setLoading(false);
        return;
      } catch (e) {
        console.error("Failed to parse stored itinerary", e);
      }
    }

    // If no stored data, redirect to generate page
    setLoading(false);
    router.push("/generate");
  }, [router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalCost = () => {
    const data = isEditing && editedData ? editedData : itineraryData;
    if (!data) return 0;
    return data.days.reduce((total, day) => {
      return (
        total +
        day.activities.reduce((dayTotal, activity) => {
          return dayTotal + (activity.estimatedCost || 0);
        }, 0)
      );
    }, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && itineraryData) {
      try {
        await navigator.share({
          title: `My ${itineraryData.country} Itinerary`,
          text: `Check out my ${itineraryData.duration}-day ${itineraryData.country} itinerary!`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share failed:", err);
      }
    }
  };

  const handleRegenerate = async () => {
    if (!itineraryData) return;

    setRegenerating(true);
    setError("");
    // Import Map with SSR disabled
    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: itineraryData.country,
          days: itineraryData.duration,
          travelStyle: itineraryData.travelStyle,
          budgetLevel: itineraryData.budgetLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to regenerate itinerary");
      }

      // Update with new itinerary data
      const newItineraryData = {
        ...data,
        country: itineraryData.country,
        duration: itineraryData.duration,
        travelStyle: itineraryData.travelStyle,
        budgetLevel: itineraryData.budgetLevel,
      };

      // Save to localStorage
      localStorage.setItem("last_itinerary", JSON.stringify(newItineraryData));
      setItineraryData(newItineraryData);
      setEditedData(null);
      setIsEditing(false);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  const handleEdit = () => {
    if (itineraryData) {
      setEditedData(JSON.parse(JSON.stringify(itineraryData))); // Deep copy
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditedData(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (editedData) {
      localStorage.setItem("last_itinerary", JSON.stringify(editedData));
      setItineraryData(editedData);
      setIsEditing(false);
      setEditedData(null);
    }
  };

  const handleSaveItinerary = async () => {
    const data = isEditing && editedData ? editedData : itineraryData;
    if (!data) return;

    // Get user email from localStorage
    const userStr = localStorage.getItem("aitp_user");
    if (!userStr) {
      setError("Please log in to save itineraries.");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const email = user.email;

      setError("");

      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          itineraryData: data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save itinerary");
      }

      // Show success message
      alert(
        "Itinerary saved successfully! You can view it in Saved Itineraries.",
      );
    } catch (err: any) {
      setError(err.message || "Failed to save itinerary. Please try again.");
    }
  };

  const updateActivity = (
    dayIndex: number,
    activityIndex: number,
    field: keyof Activity,
    value: string | number,
  ) => {
    if (!editedData) return;

    const updated = JSON.parse(JSON.stringify(editedData));
    updated.days[dayIndex].activities[activityIndex][field] = value;
    setEditedData(updated);
  };

  const handleGenerateNewActivity = async (
    dayIndex: number,
    activityIndex: number,
  ) => {
    const data = isEditing && editedData ? editedData : itineraryData;
    if (!data) return;

    const day = data.days[dayIndex];
    const activity = day.activities[activityIndex];
    const activityKey = `${dayIndex}-${activityIndex}`;

    setRegeneratingActivity(activityKey);
    setError("");

    try {
      const response = await fetch("/api/generate-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: data.country,
          city: day.city,
          day: day.day,
          time: activity.time,
          travelStyle: data.travelStyle,
          budgetLevel: data.budgetLevel,
        }),
      });

      const newActivity = await response.json();

      if (!response.ok) {
        throw new Error(newActivity.error || "Failed to generate new activity");
      }

      // Update the activity
      if (isEditing && editedData) {
        const updated = JSON.parse(JSON.stringify(editedData));
        updated.days[dayIndex].activities[activityIndex] = newActivity;
        setEditedData(updated);
      } else {
        const updated = JSON.parse(JSON.stringify(itineraryData));
        updated.days[dayIndex].activities[activityIndex] = newActivity;
        setItineraryData(updated);
        localStorage.setItem("last_itinerary", JSON.stringify(updated));
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setRegeneratingActivity(null);
    }
  };

  const handleGenerateNewCity = async (dayIndex: number) => {
    const data = isEditing && editedData ? editedData : itineraryData;
    if (!data) return;

    setRegeneratingCity(dayIndex);
    setError("");

    try {
      // Get list of current cities to avoid duplicates
      const currentCities = data.days.map((d) => d.city);

      const response = await fetch("/api/generate-city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: data.country,
          day: data.days[dayIndex].day,
          travelStyle: data.travelStyle,
          budgetLevel: data.budgetLevel,
          currentCities: currentCities,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate new city");
      }

      const newCity = result.city;
      const day = data.days[dayIndex];

      // Regenerate all activities for the new city
      const newActivities = await Promise.all(
        day.activities.map(async (activity) => {
          try {
            const activityResponse = await fetch("/api/generate-activity", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                country: data.country,
                city: newCity,
                day: day.day,
                time: activity.time,
                travelStyle: data.travelStyle,
                budgetLevel: data.budgetLevel,
              }),
            });

            const newActivity = await activityResponse.json();

            if (!activityResponse.ok) {
              throw new Error(
                newActivity.error || "Failed to generate activity",
              );
            }

            return newActivity;
          } catch (err: any) {
            // If activity generation fails, keep the original activity but update coordinates to 0
            console.error(`Failed to regenerate activity: ${err.message}`);
            return {
              ...activity,
              name: `${activity.name} (Location may need update)`,
              lat: 0,
              lng: 0,
            };
          }
        }),
      );

      // Update the city and all activities
      if (isEditing && editedData) {
        const updated = JSON.parse(JSON.stringify(editedData));
        updated.days[dayIndex].city = newCity;
        updated.days[dayIndex].activities = newActivities;
        setEditedData(updated);
      } else {
        const updated = JSON.parse(JSON.stringify(itineraryData));
        updated.days[dayIndex].city = newCity;
        updated.days[dayIndex].activities = newActivities;
        setItineraryData(updated);
        localStorage.setItem("last_itinerary", JSON.stringify(updated));
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setRegeneratingCity(null);
    }
  };
  const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
        Loading Map...
      </div>
    ),
  });

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your itinerary...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!itineraryData) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  Your {itineraryData.country} Itinerary
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg
                      className="mr-1.5 h-4 w-4"
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
                    {itineraryData.duration} days
                  </span>
                  <span className="flex items-center">
                    <svg
                      className="mr-1.5 h-4 w-4"
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
                    {itineraryData.travelStyle}
                  </span>
                  <span className="flex items-center">
                    <svg
                      className="mr-1.5 h-4 w-4"
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
                    {itineraryData.budgetLevel}
                  </span>
                  <span className="flex items-center font-semibold text-blue-600">
                    <svg
                      className="mr-1.5 h-4 w-4"
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
                    Total: {formatCurrency(calculateTotalCost())}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {!isEditing ? (
                  <>
                    <Button
                      onClick={handleEdit}
                      variant="primary"
                      className="text-sm"
                    >
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Button>
                    <Button
                      onClick={handleRegenerate}
                      variant="secondary"
                      loading={regenerating}
                      disabled={regenerating}
                      className="text-sm"
                    >
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      {regenerating ? "Regenerating..." : "Regenerate"}
                    </Button>
                    <Button
                      onClick={handleSaveItinerary}
                      variant="secondary"
                      className="text-sm"
                    >
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
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      Save
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="secondary"
                      className="text-sm"
                    >
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      Share
                    </Button>
                    <Button
                      onClick={handlePrint}
                      variant="secondary"
                      className="text-sm"
                    >
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
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                      Print
                    </Button>
                    <Button
                      href="/generate"
                      variant="secondary"
                      className="text-sm"
                    >
                      Create New
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleSaveEdit}
                      variant="primary"
                      className="text-sm"
                    >
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="secondary"
                      className="text-sm"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Interactive Map Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Route Map</h3>
              <div className="flex gap-2">
                {(isEditing && editedData ? editedData : itineraryData).days.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    className={`px-3 py-1 text-xs rounded-full transition ${activeDay === i ? "bg-blue-600 text-white" : "bg-white text-gray-600 border"}`}
                  >
                    Day {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <Map
              activities={(isEditing && editedData ? editedData : itineraryData).days[activeDay].activities}
              center={[
                (isEditing && editedData ? editedData : itineraryData).days[activeDay].activities[0]?.lat ?? 0,
                (isEditing && editedData ? editedData : itineraryData).days[activeDay].activities[0]?.lng ?? 0,
              ]}
            />
          </div>

          {/* Itinerary Days */}
          <div className="space-y-6">
            {(isEditing && editedData ? editedData : itineraryData).days.map(
              (day, dayIndex) => (
                <div
                  key={day.day}
                  className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 print:shadow-none print:ring-0"
                >
                  <div className="mb-6 flex items-center space-x-4 border-b border-gray-200 pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-md">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Day {day.day}
                      </h2>
                      <div className="mt-1 flex items-center gap-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={day.city}
                            onChange={(e) => {
                              if (!editedData) return;
                              const updated = JSON.parse(
                                JSON.stringify(editedData),
                              );
                              updated.days[dayIndex].city = e.target.value;
                              setEditedData(updated);
                            }}
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          />
                        ) : (
                          <p className="text-base text-gray-600">{day.city}</p>
                        )}
                        <Button
                          onClick={() => handleGenerateNewCity(dayIndex)}
                          variant="secondary"
                          loading={regeneratingCity === dayIndex}
                          disabled={regeneratingCity === dayIndex}
                          className="text-xs whitespace-nowrap"
                        >
                          <svg
                            className="mr-1.5 h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          New City
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {day.activities.map((activity, idx) => (
                      <div
                        key={idx}
                        className={`group rounded-xl border p-5 transition-all ${
                          isEditing
                            ? "border-blue-300 bg-blue-50/50"
                            : "border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:shadow-md hover:border-blue-300"
                        }`}
                      >
                        <div className="flex flex-col gap-4">
                          {isEditing ? (
                            <>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                  <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Activity Name
                                  </label>
                                  <input
                                    type="text"
                                    value={activity.name}
                                    onChange={(e) =>
                                      updateActivity(
                                        dayIndex,
                                        idx,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Time (HH:MM)
                                  </label>
                                  <input
                                    type="text"
                                    value={activity.time}
                                    onChange={(e) =>
                                      updateActivity(
                                        dayIndex,
                                        idx,
                                        "time",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                    placeholder="09:00"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                  Description
                                </label>
                                <textarea
                                  value={activity.description}
                                  onChange={(e) =>
                                    updateActivity(
                                      dayIndex,
                                      idx,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  rows={3}
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                              </div>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                                <div>
                                  <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Latitude
                                  </label>
                                  <input
                                    type="number"
                                    step="0.0001"
                                    value={activity.lat}
                                    onChange={(e) =>
                                      updateActivity(
                                        dayIndex,
                                        idx,
                                        "lat",
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Longitude
                                  </label>
                                  <input
                                    type="number"
                                    step="0.0001"
                                    value={activity.lng}
                                    onChange={(e) =>
                                      updateActivity(
                                        dayIndex,
                                        idx,
                                        "lng",
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Cost ($)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={activity.estimatedCost}
                                    onChange={(e) =>
                                      updateActivity(
                                        dayIndex,
                                        idx,
                                        "estimatedCost",
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Travel Time (min)
                                  </label>
                                  <input
                                    type="number"
                                    value={activity.travelTimeMinutes}
                                    onChange={(e) =>
                                      updateActivity(
                                        dayIndex,
                                        idx,
                                        "travelTimeMinutes",
                                        parseInt(e.target.value) || 0,
                                      )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  onClick={() =>
                                    handleGenerateNewActivity(dayIndex, idx)
                                  }
                                  variant="secondary"
                                  loading={
                                    regeneratingActivity ===
                                    `${dayIndex}-${idx}`
                                  }
                                  disabled={
                                    regeneratingActivity ===
                                    `${dayIndex}-${idx}`
                                  }
                                  className="text-xs"
                                >
                                  <svg
                                    className="mr-1.5 h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                  </svg>
                                  Generate New
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1">
                                  <div className="mb-2 flex flex-wrap items-center gap-3">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                                      {activity.time}
                                    </span>
                                    {idx > 0 &&
                                      activity.travelTimeMinutes > 0 && (
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                          🚗 {activity.travelTimeMinutes} min
                                          travel
                                        </span>
                                      )}
                                    {activity.estimatedCost > 0 && (
                                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                        {formatCurrency(activity.estimatedCost)}
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                                    {activity.name}
                                  </h3>
                                  <p className="mb-3 text-sm leading-relaxed text-gray-600">
                                    {activity.description}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <svg
                                      className="h-4 w-4"
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
                                    <span>
                                      {activity.lat.toFixed(4)},{" "}
                                      {activity.lng.toFixed(4)}
                                    </span>
                                    <a
                                      href={`https://www.google.com/maps?q=${activity.lat},${activity.lng}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-2 text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                      View on Maps
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  onClick={() =>
                                    handleGenerateNewActivity(dayIndex, idx)
                                  }
                                  variant="secondary"
                                  loading={
                                    regeneratingActivity ===
                                    `${dayIndex}-${idx}`
                                  }
                                  disabled={
                                    regeneratingActivity ===
                                    `${dayIndex}-${idx}`
                                  }
                                  className="text-xs"
                                >
                                  <svg
                                    className="mr-1.5 h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                  </svg>
                                  Generate New
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/generate" variant="primary">
              Generate Another Itinerary
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
