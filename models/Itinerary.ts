import mongoose, { Document, Model, Schema } from "mongoose";

export interface IItinerary extends Document {
  userId: mongoose.Types.ObjectId;
  country: string;
  duration: number;
  travelStyle: string;
  budgetLevel: string;
  days: Array<{
    day: number;
    city: string;
    activities: Array<{
      name: string;
      description: string;
      lat: number;
      lng: number;
      time: string;
      estimatedCost: number;
      travelTimeMinutes: number;
    }>;
  }>;
  name?: string;
  savedAt: Date;
}

const ItinerarySchema = new Schema<IItinerary>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    country: { type: String, required: true },
    duration: { type: Number, required: true },
    travelStyle: { type: String, required: true },
    budgetLevel: { type: String, required: true },
    days: [
      {
        day: { type: Number, required: true },
        city: { type: String, required: true },
        activities: [
          {
            name: { type: String, required: true },
            description: { type: String, required: true },
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            time: { type: String, required: true },
            estimatedCost: { type: Number, default: 0 },
            travelTimeMinutes: { type: Number, default: 0 },
          },
        ],
      },
    ],
    name: { type: String },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Re-use existing model if it exists
const Itinerary: Model<IItinerary> =
  mongoose.models.Itinerary ||
  mongoose.model<IItinerary>("Itinerary", ItinerarySchema);

export default Itinerary;

