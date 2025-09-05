/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression, LatLngBounds, LatLngTuple } from "leaflet";
import { Restaurant } from "@/interfaces/restaurants";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

const restaurantIcon = new L.Icon({
  iconUrl: "/images/logo.png", // Path to your icon image in the /public folder
  iconSize: [35, 35], // Size of the icon [width, height]
  iconAnchor: [17, 35], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -35], // Point from which the popup should open relative to the iconAnchor
});
// --- End of new code ---

// A simple debounce utility to prevent excessive API calls
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

interface RestaurantMapProps {
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
}

const DEFAULT_CENTER: LatLngExpression = [53.345, -6.26];
const API_URL = "";
const API_KEY = "";

// A separate component to handle map events
const MapEventsHandler = ({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: LatLngBounds) => void;
}) => {
  useMapEvents({
    moveend: (event) => {
      const map = event.target;
      onBoundsChange(map.getBounds());
    },
  });
  return null;
};

const MapComponent: React.FC<RestaurantMapProps> = ({
  center = DEFAULT_CENTER,
  zoom = 13,
  className = "h-[450px] w-full",
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch data based on a polygon
  const fetchData = useCallback(async (bounds: LatLngBounds) => {
    setLoading(true);
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const polygon = [
      { lat: sw.lat, lng: sw.lng },
      { lat: ne.lat, lng: sw.lng },
      { lat: ne.lat, lng: ne.lng },
      { lat: sw.lat, lng: ne.lng },
      { lat: sw.lat, lng: sw.lng },
    ];

    const payload = { polygon };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response?.json();
      setRestaurants(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce the fetch function to limit API calls
  const debouncedFetchData = useCallback(
    debounce((bounds: LatLngBounds) => {
      fetchData(bounds);
    }, 500),
    [fetchData]
  );

  return (
    <div className={`rounded-xl shadow-lg ${className}`}>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-20 rounded-xl">
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      )}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapEventsHandler onBoundsChange={debouncedFetchData} />

        {restaurants?.map((restaurant) => {
          const position: LatLngTuple = [restaurant?.lat, restaurant?.lng];
          return (
            <Marker
              key={restaurant?.id}
              position={position}
              icon={restaurantIcon}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold">{restaurant?.name}</h3>
                  {restaurant.address && (
                    <p className="text-sm text-gray-600 mt-1">
                      {restaurant?.address?.content}
                    </p>
                  )}
                  {restaurant && (
                    <p className="text-sm text-blue-600 mt-1">{"phone"}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
