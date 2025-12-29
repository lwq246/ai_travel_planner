import connectDB from "@/config/database";
import Itinerary from "@/models/Itinerary";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// DELETE - Delete an itinerary
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
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

    // Find itinerary that belongs to the user
    const itinerary = await Itinerary.findOne({
      _id: id,
      userId: user._id,
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: "Itinerary not found" },
        { status: 404 }
      );
    }

    await Itinerary.deleteOne({ _id: id });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting itinerary:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete itinerary" },
      { status: 500 }
    );
  }
}
