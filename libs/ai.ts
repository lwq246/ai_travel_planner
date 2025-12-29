export const itineraryPrompt = (input: {
    country: string;
    days: number;
    travelStyle: string;
    budgetLevel: string;
  }) => `
  You are an expert travel planner. Generate a detailed day-by-day itinerary for:
  - Country: ${input.country}
  - Duration: ${input.days} days
  - Travel style: ${input.travelStyle}
  - Budget level: ${input.budgetLevel}
  
  Rules:
  1. Respond ONLY with valid JSON. No explanations.
  2. Every day must include 2–4 activities.
  3. Each activity must include:
     - name
     - description
     - lat (latitude)
     - lng (longitude)
     - time (start time)
     - estimatedCost
     - travelTimeMinutes (travel time between previous activity)
  4. Optimize routes logically (no jumping places).
  5. Use budgetLevel to choose expensive / cheap places.
  
  Return format:
  {
    "days": [...]
  }
  `;
  