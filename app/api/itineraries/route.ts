import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Itinerary from "@/models/Itinerary";
import User from "@/models/User";

// GET - Retrieve all itineraries for the logged-in user
export async function GET(req: Request) {
  try {
    await connectDB();

    // Get user email from query params or headers
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find all itineraries for this user
    const itineraries = await Itinerary.find({ userId: user._id })
      .sort({ savedAt: -1 })
      .lean();

    return NextResponse.json(itineraries);
  } catch (err: any) {
    console.error("Error fetching itineraries:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch itineraries" },
      { status: 500 }
    );
  }
}

// POST - Save a new itinerary
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, itineraryData } = body;

    if (!email) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    if (!itineraryData) {
      return NextResponse.json(
        { error: "Itinerary data is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new itinerary
    const itinerary = new Itinerary({
      userId: user._id,
      country: itineraryData.country,
      duration: itineraryData.duration,
      travelStyle: itineraryData.travelStyle,
      budgetLevel: itineraryData.budgetLevel,
      days: itineraryData.days,
      name: itineraryData.name || `${itineraryData.country} - ${itineraryData.duration} days`,
      savedAt: new Date(),
    });

    await itinerary.save();

    return NextResponse.json({
      success: true,
      itinerary: itinerary.toObject(),
    });
  } catch (err: any) {
    console.error("Error saving itinerary:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save itinerary" },
      { status: 500 }
    );
  }
}

