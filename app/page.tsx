import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            Plan Your Perfect Trip
            <span className="block text-blue-600">With AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 sm:text-2xl">
            Generate personalized itineraries in seconds. Let AI create your
            dream vacation plan.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              href="/generate"
              variant="primary"
              className="text-lg px-8 py-4"
            >
              Start Planning
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need for Perfect Travel Planning
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features designed to make your trip planning effortless
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1: AI Itinerary Generator */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                AI Itinerary Generator
              </h3>
              <p className="text-gray-600">
                Get personalized travel plans tailored to your preferences,
                budget, and travel style. Our AI creates the perfect itinerary
                for you.
              </p>
            </div>

            {/* Feature 2: Real-Time Maps */}
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Real-Time Maps
              </h3>
              <p className="text-gray-600">
                Visualize your itinerary on interactive maps with routes,
                markers, and real-time location data for seamless navigation.
              </p>
            </div>

            {/* Feature 3: Save & Share Trips */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Save & Share Trips
              </h3>
              <p className="text-gray-600">
                Save your favorite itineraries and share them with friends and
                family. Access your plans anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
