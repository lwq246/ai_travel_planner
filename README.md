# 🌍 AI Travel Planner

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemma 3](https://img.shields.io/badge/AI-Gemma_3_1B-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

An intelligent travel itinerary generator powered by **Google's Gemma 3 1B** model. This full-stack application allows users to generate, customize, and save personalized travel plans based on destination, duration, and budget.

[**View Live Demo**](https://your-project-url.vercel.app) · [**Report Bug**](https://github.com/yourusername/repo/issues)

---

## 📸 Screenshots

<!-- Add a screenshot of your app here. If you don't have one, you can remove this section -->
![App Interface](https://via.placeholder.com/800x450?text=AI+Travel+Planner+Screenshot)

## ✨ Features

- **🤖 AI-Powered Itineraries**: Generates detailed day-by-day plans using the lightweight but powerful **Gemma 3 1B** model.
- **🔐 User Authentication**: Secure login and signup functionality to manage user sessions.
- **🎛️ Custom Parameters**:
  - **Destination**: Input any city or country.
  - **Duration**: Specify the number of days.
  - **Budget**: Select from Budget, Moderate, or Luxury tiers.
- **💾 Save & Retrieve**: Users can save generated itineraries to their dashboard (stored in MongoDB) for future access.
- **⚡ High Performance**: Built with Next.js for fast server-side rendering and static generation.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB (via Mongoose)
- **AI Model**: Google Gemma 3 1B
- **Deployment**: Vercel

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v18+)
- MongoDB connection string (Atlas or Local)
- API Key for Gemma Model access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lwq246/ai-travel-planner.git
   cd ai-travel-planner
