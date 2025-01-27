"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure Leaflet marker icons.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Loader component for a consistent loading state.
const Loader = () => (
  <div className="absolute z-[10000] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <svg
      aria-hidden="true"
      className="w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  </div>
);

const MapComponent = () => {
  const [markerData, setMarkerData] = useState<{ coordinates: [number, number]; title: string } | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<{ coordinates: [number, number]; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the user's current location
  const fetchCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMarkerData({
          coordinates: [latitude, longitude],
          title: "Your Current Location",
        });

        // Fetch nearby hospitals
        await fetchNearbyHospitals(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setError("Unable to retrieve your location. Please enable location services and try again.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true, // Use high accuracy mode
        timeout: 10000, // 10 seconds timeout
        maximumAge: 0, // Do not use a cached position
      }
    );
  };

  // Fetch nearby hospitals using OpenStreetMap Nominatim
  const fetchNearbyHospitals = async (lat: number, lon: number) => {
    try {
      const radius = 5000; // Search within a 5km radius
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=hospital&lat=${lat}&lon=${lon}&radius=${radius}&limit=10`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const hospitals = data.map((place: any) => ({
          coordinates: [parseFloat(place.lat), parseFloat(place.lon)],
          name: place.display_name,
        }));
        setNearbyHospitals(hospitals);
      } else {
        setError("No hospitals found nearby.");
      }
    } catch (err) {
      console.error("Error fetching nearby hospitals:", err);
      setError("Failed to fetch nearby hospitals. Please try again later.");
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  return (
    <>
      {loading && <Loader />}
      {error && (
        <div className="absolute z-[10000] top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded-md">
          {error}
        </div>
      )}
      <MapContainer
        center={markerData?.coordinates || [28.474388, 77.503990]} // Fallback to default coordinates
        zoom={15}
        style={{ height: "80vh", width: "84vw" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markerData?.coordinates && (
          <Marker position={markerData.coordinates}>
            <Popup>{markerData.title}</Popup>
          </Marker>
        )}
        {nearbyHospitals.map((hospital, index) => (
          <Marker key={index} position={hospital.coordinates}>
            <Popup>{hospital.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <button
        onClick={fetchCurrentLocation}
        className="absolute bottom-5 right-5 z-[100000] py-1 px-3 bg-green-600 text-white font-semibold rounded-sm shadow-md hover:bg-green-700 transition"
      >
        Find Hospitals Near Me
      </button>
    </>
  );
};

export default MapComponent;