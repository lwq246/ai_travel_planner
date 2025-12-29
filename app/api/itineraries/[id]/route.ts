import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Itinerary from "@/models/Itinerary";
import User from "@/models/User";

// DELETE - Delete an itinerary
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

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

    // Find and delete itinerary (only if it belongs to the user)
    const itinerary = await Itinerary.findOne({
      _id: params.id,
      userId: user._id,
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: "Itinerary not found" },
        { status: 404 }
      );
    }

    await Itinerary.deleteOne({ _id: params.id });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting itinerary:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete itinerary" },
      { status: 500 }
    );
  }
}

