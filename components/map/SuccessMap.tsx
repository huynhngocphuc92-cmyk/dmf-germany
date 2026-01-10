"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { successStories, type CityPlacement } from "@/lib/data/success-stories";

// Fix Leaflet default icon issue
// Using CDN for icon assets to avoid import issues
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png";
const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

// Create custom icon
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// Set default icon for all markers
if (typeof window !== "undefined") {
  L.Marker.prototype.options.icon = DefaultIcon;
}

/**
 * Success Map Component
 * Displays interactive map with placement markers across Germany
 * 
 * Note: This component is wrapped by MapWrapper.tsx for SSR: false support
 */
export const SuccessMap = () => {
  // Default map center (center of Germany)
  const defaultCenter: [number, number] = [51.1657, 10.4515];
  const defaultZoom = 6;

  return (
    <div className="w-full h-[600px] md:h-[80vh] rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render markers for each city */}
        {successStories.map((city: CityPlacement) => (
          <Marker key={city.id} position={city.position}>
            <Popup>
              <div className="min-w-[200px] p-2">
                <h3 className="font-bold text-lg text-primary mb-2">{city.city}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">{city.candidateCount}+ Vermittlungen</span>
                </p>
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Branchen:</p>
                  <p className="text-xs text-gray-700">
                    {city.jobTypes.join(", ")}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
