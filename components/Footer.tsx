export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold text-blue-400">✈️</div>
              <span className="text-xl font-bold text-white">
                AI Travel Planner
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Plan your perfect trip with AI-powered itinerary generation.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} AI Travel Planner. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
