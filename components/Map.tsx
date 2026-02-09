"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

interface Activity {
  name: string;
  lat: number;
  lng: number;
}

interface MapProps {
  activities: Activity[];
  center: [number, number];
}

// --- NEW: Custom Numbered Marker Function ---
const createNumberedIcon = (number: number) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <!-- Outer Ring (Pulse Effect) -->
        <div class="absolute w-10 h-10 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
        <!-- Main Marker Pin Shape -->
        <div class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full border-2 border-white shadow-lg font-bold text-sm">
          ${number}
        </div>
        <!-- Pointer Tip -->
        <div class="absolute -bottom-1 w-2 h-2 bg-blue-600 rotate-45 border-r-2 border-b-2 border-white"></div>
      </div>
    `,
    className: "custom-div-icon", // Prevents Leaflet from adding default styles
    iconSize: [32, 32],
    iconAnchor: [16, 32], // Points the bottom tip to the coordinate
    popupAnchor: [0, -32], // Positions popup above the marker
  });
};

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14); // Zoom in slightly more for clarity
  }, [center, map]);
  return null;
}

export default function Map({ activities, center }: MapProps) {
  return (
    <div className="h-[400px] w-full overflow-hidden rounded-2xl border-2 border-white shadow-2xl">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <RecenterMap center={center} />
        {/* Using a cleaner Map Style (CartoDB Positron) for better symbol contrast */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {activities.map(
          (activity, idx) =>
            activity.lat !== 0 && (
              <Marker
                key={idx}
                position={[activity.lat, activity.lng]}
                icon={createNumberedIcon(idx + 1)} // Passing the activity sequence number
              >
                <Popup>
                  <div className="p-1 font-sans">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Stop ${idx + 1}
                    </p>
                    <p className="font-bold text-blue-700 text-sm">
                      {activity.name}
                    </p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${activity.lat},${activity.lng}`}
                      target="_blank"
                      className="text-xs text-blue-500 hover:underline block mt-2"
                    >
                      Get Directions →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ),
        )}
      </MapContainer>
    </div>
  );
}
