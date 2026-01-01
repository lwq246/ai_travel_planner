🌍 AI Travel Planner

![alt text](https://img.shields.io/badge/license-MIT-blue.svg)

![alt text](https://img.shields.io/badge/Next.js-14-black)

![alt text](https://img.shields.io/badge/MongoDB-Atlas-green)

![alt text](https://img.shields.io/badge/Deployed%20on-Vercel-black)

![alt text](https://img.shields.io/badge/AI-Google%20Gemma%203%201B-blueviolet)

An intelligent travel itinerary generator powered by Google's Gemma 3 1B model. This application creates personalized travel plans based on your destination, duration, and budget, allowing you to save and manage your trips effortlessly.

✨ Features

🔐 Secure Authentication: User login and registration system to keep your data safe.

🤖 AI-Powered Itineraries: Utilizes the Gemma 3 1B model to generate detailed day-by-day travel plans.

🎛️ Customizable Preferences:

Select your Destination.

Choose the Number of Days.

Set your Budget Level (Budget, Moderate, Luxury).

💾 Save & Manage Trips: Generated plans are saved to your profile via MongoDB for future reference.

⚡ Fast & Responsive: Built with Next.js for server-side rendering and high performance.

🛠️ Tech Stack

Frontend: Next.js, React, Tailwind CSS[2]

Backend: Next.js API Routes (Serverless functions)

Database: MongoDB (via Mongoose)

AI Model: Google Gemma 3 1B (Running via Hugging Face Inference / Google Vertex AI / Local API)

Deployment: Vercel

🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

Prerequisites

Node.js (v18 or higher)

MongoDB Atlas account (or local MongoDB)[3]

API Key for Gemma Model access (e.g., Hugging Face Token or Google AI Studio Key)

Installation
Clone the repository
code
Bash
git clone https://github.com/your-username/ai-travel-planner.git
cd ai-travel-planner
Install dependencies
code
Bash
npm install[[4](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHvdstM9j3lG_jgLbfXFD5z8jclCnoSs3XhtufjeHpEmcBOR9kVfLM3Usov4HXqgg9DgK15OQpyR04hW5ajXzeF8sztFuslHWoJ9DctC8qmafDQq0R1J9rlCHAbDQMFOg4UPlL9ZoItBg9jV9AS3cTqUt-Lc8fD)][[5](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQEoygDKmVC4whUOkxKY4gf4zXl4xlUjXqdUWk6zh1GEvzml8cx1Sk0pblo6o36F1j36UklCahi3pGel0OQ3jmfngZS08RRVz1gUsPv0K83EBzgjJh_s-iNRvdXS2YPxYSdR6PI%3D)][[6](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQEbjhlX5h7ZoXMYvIT9qCKqmTT27nbJ-XX4VpRqYR7km7_z13p7vtj2uqwDTqVj7Eit6I3GzVspni89EbSl_MsYLGLhJQGrLW9tEOHv4bzAJ0FboA6SCIvYC0QoI6SSLbUiKtXzzgXLtF1TxUQ%3D)]
# or
yarn install
Set up Environment Variables
Create a .env.local file in the root directory and add the following:
code
Env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string[[4](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHvdstM9j3lG_jgLbfXFD5z8jclCnoSs3XhtufjeHpEmcBOR9kVfLM3Usov4HXqgg9DgK15OQpyR04hW5ajXzeF8sztFuslHWoJ9DctC8qmafDQq0R1J9rlCHAbDQMFOg4UPlL9ZoItBg9jV9AS3cTqUt-Lc8fD)]

# Authentication (if using NextAuth)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# AI Model API Key
GEMMA_API_KEY=your_api_key_here
Run the development server
code
Bash
npm run dev
```[[3](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQGj52EN_Lb2megXQUkxX2HoYExcMbfgKIcZLCNgaW67zgj_o47UQckfrhAht-cp2mlBcegmEIypAhYX07-sTv4HnOpqZlfDaXr3MdyEKqx3h6vtOG4wPj_h5oyvflDHDMJzUqws--pklXiwzblMsMSQFhVBTW2RRbEH4FAv55lS)][[4](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHvdstM9j3lG_jgLbfXFD5z8jclCnoSs3XhtufjeHpEmcBOR9kVfLM3Usov4HXqgg9DgK15OQpyR04hW5ajXzeF8sztFuslHWoJ9DctC8qmafDQq0R1J9rlCHAbDQMFOg4UPlL9ZoItBg9jV9AS3cTqUt-Lc8fD)][[5](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQEoygDKmVC4whUOkxKY4gf4zXl4xlUjXqdUWk6zh1GEvzml8cx1Sk0pblo6o36F1j36UklCahi3pGel0OQ3jmfngZS08RRVz1gUsPv0K83EBzgjJh_s-iNRvdXS2YPxYSdR6PI%3D)]
Open your browser
Visit http://localhost:3000 to see the app in action.[3][4]
📝 Usage
Sign Up/Login: Create an account to start planning.
Create a Trip: Click on "Plan New Trip".
Enter Details: Type a city (e.g., "Tokyo"), select duration (e.g., "5 Days"), and budget (e.g., "Moderate").
Generate: Hit the "Generate Plan" button and wait for the AI to work its magic.
Save: Once satisfied with the itinerary, save it to your dashboard.
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments
Thanks to Google for the open-source Gemma models.[7]
Hosted on Vercel.[4][8]
