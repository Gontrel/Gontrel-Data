"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";

interface UserData {
  id: string;
  displayName: string;
  username: string;
  email: string;
  lat: number;
  lng: number;
  type: string;
  isVerified: boolean;
  profileImage: string;
}

interface RestaurantData {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  isVerified: boolean;
  type: string;
  phoneNumber: string;
  website: string;
}

interface UserClusterMapProps {
  height?: number;
}

const DUBLIN_CENTER: [number, number] = [53.344, -6.2675];

const DUBLIN_POLYGON = [
  { lat: 53.46, lng: -6.50 },
  { lat: 53.46, lng: -6.03 },
  { lat: 53.19, lng: -6.03 },
  { lat: 53.19, lng: -6.50 },
  { lat: 53.46, lng: -6.50 },
];

function createUserClusterIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div class="user-cluster"></div>`,
    className: "leaflet-div-icon-custom",
    iconSize: [0, 0],
  });
}

function createRestaurantClusterIcon(): L.DivIcon {
  return L.divIcon({
    html: `
      <div class="restaurant-cluster-container">
        <img src="/icons/house-2.png" class="restaurant-cluster-icon" />
      </div>`,
    className: "leaflet-div-icon-custom",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

function createUserIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div class="user-marker-wrapper"><img src="/icons/profile.png" class="user-marker-icon" /></div>`,
    className: "leaflet-div-icon-custom",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

type StatusType = "many_users" | "many_restaurants" | "healthy_mix" | "desert";

function getStatusLabel(type: StatusType): string {
  switch (type) {
    case "many_users": return "Many users, no restaurants";
    case "many_restaurants": return "Many restaurants, few users";
    case "healthy_mix": return "Healthy mix";
    case "desert": return "Desert";
  }
}

function getStatusDotColor(type: StatusType): string {
  switch (type) {
    case "many_users": return "rgba(202, 51, 255, 1)";
    case "many_restaurants": return "rgba(255, 168, 0, 1)";
    case "healthy_mix": return "rgba(0, 194, 6, 1)";
    case "desert": return "rgba(241, 51, 51, 1)";
  }
}

function createStatusMarkerIcon(type: StatusType): L.DivIcon {
  const label = getStatusLabel(type);
  const color = getStatusDotColor(type);
  return L.divIcon({
    html: `
      <div class="status-marker-container">
        <div class="status-marker-dot" style="background:${color}"></div>
        <span class="status-marker-text">${label}</span>
      </div>`,
    className: "leaflet-div-icon-custom",
    iconSize: undefined,
    iconAnchor: [0, 12],
  });
}

function determineStatus(userCount: number, restaurantCount: number): StatusType {
  if (userCount === 0 && restaurantCount === 0) return "desert";
  if (restaurantCount === 0 && userCount > 0) return "many_users";
  if (userCount === 0 && restaurantCount > 0) return "many_restaurants";
  const ratio = userCount / restaurantCount;
  if (ratio >= 0.5 && ratio <= 3) return "healthy_mix";
  if (ratio < 0.5) return "many_restaurants";
  return "many_users";
}

function getStatusForLocation(
  lat: number,
  lng: number,
  bounds: L.LatLngBounds,
  users: UserData[],
  restaurants: RestaurantData[]
): StatusType | null {
  const north = bounds.getNorth();
  const south = bounds.getSouth();
  const east = bounds.getEast();
  const west = bounds.getWest();
  if (lat < south || lat > north || lng < west || lng > east) return null;

  const row = Math.min(2, Math.floor(((lat - south) / (north - south)) * 3));
  const col = Math.min(2, Math.floor(((lng - west) / (east - west)) * 3));
  const cellSouth = south + (row * (north - south)) / 3;
  const cellNorth = south + ((row + 1) * (north - south)) / 3;
  const cellWest = west + (col * (east - west)) / 3;
  const cellEast = west + ((col + 1) * (east - west)) / 3;

  const userCount = users.filter(
    user => user.lat >= cellSouth && user.lat <= cellNorth && user.lng >= cellWest && user.lng <= cellEast
  ).length;
  const restaurantCount = restaurants.filter(
    restaurant => restaurant.lat >= cellSouth && restaurant.lat <= cellNorth && restaurant.lng >= cellWest && restaurant.lng <= cellEast
  ).length;

  return determineStatus(userCount, restaurantCount);
}

function createRestaurantIcon(): L.DivIcon {
  return L.divIcon({
    html: `
      <div class="restaurant-cluster-container">
        <img src="/icons/house-2.png" class="restaurant-cluster-icon" />
      </div>`,
    className: "leaflet-div-icon-custom",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

function MapController({
  onMoveEnd,
  onReady,
}: {
  onMoveEnd: (bounds: L.LatLngBounds) => void;
  onReady: (map: L.Map, userClusterGroup: L.MarkerClusterGroup, restaurantClusterGroup: L.MarkerClusterGroup, statusLayer: L.LayerGroup) => void;
}) {
  const map = useMap();
  const readyRef = useRef(false);

  useEffect(() => {
    if (!readyRef.current) {
      readyRef.current = true;
      const userClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 50,
        iconCreateFunction: (cluster: L.MarkerCluster) => {
          return createUserClusterIcon();
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
      });
      const restaurantClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 0,
        spiderfyOnMaxZoom: false,
        spiderfyOnEveryZoom: false,
        zoomToBoundsOnClick: false,
        animate: false,
        showCoverageOnHover: false,
      });
      const statusLayer = L.layerGroup();
      map.addLayer(userClusterGroup);
      map.addLayer(restaurantClusterGroup);
      map.addLayer(statusLayer);
      onReady(map, userClusterGroup, restaurantClusterGroup, statusLayer);
    }

    const handler = () => {
      onMoveEnd(map.getBounds());
    };
    map.on("moveend", handler);
    map.on("zoomend", handler);
    return () => {
      map.off("moveend", handler);
      map.off("zoomend", handler);
    };
  }, [map, onMoveEnd, onReady]);

  return null;
}

const UserClusterMap = ({ height = 500 }: UserClusterMapProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"restaurants" | "users" | StatusType | null>(null);
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const userClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const restaurantClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const statusLayerRef = useRef<L.LayerGroup | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const fetchData = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const polygon = DUBLIN_POLYGON;

      const [usersRes, restaurantsRes] = await Promise.all([
        fetch("/api/users-by-polygon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ polygon }),
          signal: controller.signal,
        }),
        fetch("/api/location-by-polygon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ polygon }),
          signal: controller.signal,
        }),
      ]);

      if (!usersRes.ok) throw new Error("Failed to fetch users");
      if (!restaurantsRes.ok) throw new Error("Failed to fetch restaurants");

      const usersData = await usersRes.json();
      const restaurantsData = await restaurantsRes.json();
      if (requestId !== requestIdRef.current) return;
      const newUsers = Array.isArray(usersData) ? usersData : [];
      const newRestaurants = Array.isArray(restaurantsData) ? restaurantsData : [];

      setUsers(newUsers);
      setRestaurants(newRestaurants);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      if (requestId === requestIdRef.current) setError("Failed to load map data");
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  const handleMoveEnd = useCallback(
    (_bounds: L.LatLngBounds) => {},
    []
  );

  const handleMapReady = useCallback(
    (map: L.Map, userClusterGroup: L.MarkerClusterGroup, restaurantClusterGroup: L.MarkerClusterGroup, statusLayer: L.LayerGroup) => {
      mapRef.current = map;
      userClusterRef.current = userClusterGroup;
      restaurantClusterRef.current = restaurantClusterGroup;
      statusLayerRef.current = statusLayer;
      fetchData();
    },
    [fetchData]
  );

  useEffect(() => {
    if (!userClusterRef.current || !mapRef.current) return;

    const clusterGroup = userClusterRef.current;
    const map = mapRef.current;
    const mapBounds = map.getBounds();
    clusterGroup.clearLayers();

    if (users.length === 0) return;
    if (activeFilter === "desert" || activeFilter === "restaurants") return;

    const userIcon = createUserIcon();

    users.forEach((user) => {
      if (user.lat == null || user.lng == null) return;
      if (activeFilter && !["users", "restaurants"].includes(activeFilter)) {
        const status = getStatusForLocation(user.lat, user.lng, mapBounds, users, restaurants);
        if (status !== activeFilter) return;
      }
      const marker = L.marker([user.lat, user.lng], { icon: userIcon });
      marker.bindPopup(
        `<div style="min-width:180px">
          <div style="font-weight:600;font-size:14px;margin-bottom:4px">${user.displayName || user.username}</div>
          <div style="font-size:12px;color:#666;margin-bottom:2px">${user.email}</div>
          <div style="font-size:12px;color:#666">Type: ${user.type}</div>
          <div style="font-size:12px;color:#666">Verified: ${user.isVerified ? "Yes" : "No"}</div>
        </div>`
      );
      clusterGroup.addLayer(marker);
    });

  }, [users, restaurants, activeFilter]);

  useEffect(() => {
    if (!restaurantClusterRef.current || !mapRef.current) return;

    const clusterGroup = restaurantClusterRef.current;
    const map = mapRef.current;
    const mapBounds = map.getBounds();
    clusterGroup.clearLayers();

    if (restaurants.length === 0) return;
    if (activeFilter === "desert" || activeFilter === "users") return;

    const restaurantIcon = createRestaurantIcon();

    restaurants.forEach((restaurant) => {
      if (restaurant.lat == null || restaurant.lng == null) return;
      if (activeFilter && !["users", "restaurants"].includes(activeFilter)) {
        const status = getStatusForLocation(restaurant.lat, restaurant.lng, mapBounds, users, restaurants);
        if (status !== activeFilter) return;
      }
      const marker = L.marker([restaurant.lat, restaurant.lng], { icon: restaurantIcon });
      marker.bindPopup(
        `<div style="min-width:200px">
          <div style="font-weight:600;font-size:14px;margin-bottom:4px">${restaurant.name}</div>
          <div style="font-size:12px;color:#666;margin-bottom:2px">${restaurant.address}</div>
          <div style="font-size:12px;color:#666;margin-bottom:2px">Rating: ${restaurant.rating}</div>
          <div style="font-size:12px;color:#666">Verified: ${restaurant.isVerified ? "Yes" : "No"}</div>
        </div>`
      );
      clusterGroup.addLayer(marker);
    });

  }, [users, restaurants, activeFilter]);

  useEffect(() => {
    if (!statusLayerRef.current || !mapRef.current) return;
    const statusLayer = statusLayerRef.current;
    const map = mapRef.current;
    statusLayer.clearLayers();

    const bounds = map.getBounds();
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const west = bounds.getWest();

    const gridCols = 3;
    const gridRows = 3;
    const cellHeight = (north - south) / gridRows;
    const cellWidth = (east - west) / gridCols;

    const matchingCellBounds: L.LatLngBounds[] = [];

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const cellSouth = south + row * cellHeight;
        const cellNorth = south + (row + 1) * cellHeight;
        const cellWest = west + col * cellWidth;
        const cellEast = west + (col + 1) * cellWidth;

        const userCount = users.filter(
          (u) => u.lat != null && u.lng != null &&
            u.lat >= cellSouth && u.lat < cellNorth &&
            u.lng >= cellWest && u.lng < cellEast
        ).length;

        const restaurantCount = restaurants.filter(
          (r) => r.lat != null && r.lng != null &&
            r.lat >= cellSouth && r.lat < cellNorth &&
            r.lng >= cellWest && r.lng < cellEast
        ).length;

        const status = determineStatus(userCount, restaurantCount);
        if (activeFilter !== null && activeFilter !== status) continue;
        const centerLat = (cellNorth + cellSouth) / 2;
        const centerLng = (cellEast + cellWest) / 2;
        const icon = createStatusMarkerIcon(status);
        const marker = L.marker([centerLat, centerLng], { icon, interactive: false, keyboard: false });
        statusLayer.addLayer(marker);

        if (activeFilter !== null && activeFilter === status) {
          matchingCellBounds.push(L.latLngBounds([cellSouth, cellWest], [cellNorth, cellEast]));
        }
      }
    }

  }, [users, restaurants, activeFilter]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-[#2E3032]">User & Restaurant Map</h2>
        <div className="flex items-center gap-4">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0070F3]"></div>
              <span>Loading...</span>
            </div>
          )}
          {error && <span className="text-sm text-red-500">{error}</span>}
          {!loading && !error && (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <img src="/icons/person.png" alt="user" className="w-3 h-3" />
                {users.length} users
              </span>
              <span className="flex items-center gap-1">
                <img src="/icons/house-2.png" alt="restaurant" className="w-4 h-4" />
                {restaurants.length} restaurants
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        style={{ height, width: "100%", borderRadius: 12, overflow: "hidden" }}
        className="relative z-0"
      >
        <MapContainer
          center={DUBLIN_CENTER}
          zoom={18}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapController onMoveEnd={handleMoveEnd} onReady={handleMapReady} />
        </MapContainer>
        <div className="map-filter-container">
          <div
            className={`map-filter-item ${activeFilter === "restaurants" ? "active" : "inactive"}`}
            onClick={() => setActiveFilter(activeFilter === "restaurants" ? null : "restaurants")}
          >
            <img src="/icons/house-2.png" alt="restaurant" className="map-filter-icon" />
            <span className="map-filter-label">Restaurants</span>
          </div>
          <div
            className={`map-filter-item ${activeFilter === "users" ? "active" : "inactive"}`}
            onClick={() => setActiveFilter(activeFilter === "users" ? null : "users")}
          >
            <img src="/icons/profile.png" alt="user" className="map-filter-icon" />
            <span className="map-filter-label">Users</span>
          </div>
          <div
            className={`map-filter-item ${activeFilter === "many_users" ? "active" : "inactive"}`}
            onClick={() => setActiveFilter(activeFilter === "many_users" ? null : "many_users")}
          >
            <div className="map-filter-dot" style={{ background: "rgba(202, 51, 255, 1)" }} />
            <div className="map-filter-text-group">
              <span className="map-filter-title">Many users, no restaurants</span>
              <span className="map-filter-desc">Demand with nowhere to go. Priority expansion zone.</span>
            </div>
          </div>
          <div
            className={`map-filter-item ${activeFilter === "many_restaurants" ? "active" : "inactive"}`}
            onClick={() => setActiveFilter(activeFilter === "many_restaurants" ? null : "many_restaurants")}
          >
            <div className="map-filter-dot" style={{ background: "rgba(255, 168, 0, 1)" }} />
            <div className="map-filter-text-group">
              <span className="map-filter-title">Many restaurants, few users</span>
              <span className="map-filter-desc">Supply exists but no audience. Creator recruitment needed.</span>
            </div>
          </div>
          <div
            className={`map-filter-item ${activeFilter === "healthy_mix" ? "active" : "inactive"}`}
            onClick={() => setActiveFilter(activeFilter === "healthy_mix" ? null : "healthy_mix")}
          >
            <div className="map-filter-dot" style={{ background: "rgba(0, 194, 6, 1)" }} />
            <div className="map-filter-text-group">
              <span className="map-filter-title">Healthy mix</span>
              <span className="map-filter-desc">Restaurants and users balanced. Core product working.</span>
            </div>
          </div>
          <div
            className={`map-filter-item ${activeFilter === "desert" ? "active" : "inactive"}`}
            onClick={() => setActiveFilter(activeFilter === "desert" ? null : "desert")}
          >
            <div className="map-filter-dot" style={{ background: "rgba(241, 51, 51, 1)" }} />
            <div className="map-filter-text-group">
              <span className="map-filter-title">Desert</span>
              <span className="map-filter-desc">No users, minimal content. Low priority for now.</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .user-cluster {
          width: 0;
          height: 0;
        }
        .user-marker-wrapper {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .user-marker-icon {
          width: 18px;
          height: 18px;
        }
        .restaurant-marker-icon {
          width: 28px;
          height: 28px;
        }
        .restaurant-cluster-container {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          border: 1px solid rgba(240, 241, 242, 1);
          background: rgba(255, 255, 255, 1);
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          box-sizing: border-box;
        }
        .restaurant-cluster-icon {
          width: 28px;
          height: 28px;
        }
        .status-marker-container {
          width: fit-content;
          height: 24px;
          border-radius: 8px;
          border: 1px solid rgba(210, 212, 213, 1);
          background: rgba(255, 255, 255, 0.5);
          padding: 4px 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-sizing: border-box;
        }
        .status-marker-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .status-marker-text {
          font-family: Figtree, sans-serif;
          font-weight: 500;
          font-size: 14px;
          line-height: 16px;
          color: rgba(77, 82, 85, 1);
          white-space: nowrap;
        }
        .leaflet-div-icon-custom {
          background: transparent;
          border: none;
        }
        .map-filter-container {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 236px;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
          z-index: 1000;
        }
        .map-filter-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .map-filter-item.inactive {
          opacity: 0.4;
        }
        .map-filter-item.active {
          opacity: 1;
        }
        .map-filter-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .map-filter-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
        }
        .map-filter-label {
          font-family: Figtree, sans-serif;
          font-weight: 400;
          font-size: 14px;
          line-height: 16px;
          color: rgba(77, 82, 85, 1);
        }
        .map-filter-text-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .map-filter-title {
          font-family: Figtree, sans-serif;
          font-weight: 500;
          font-size: 14px;
          line-height: 16px;
          color: rgba(77, 82, 85, 1);
        }
        .map-filter-desc {
          font-family: Figtree, sans-serif;
          font-weight: 400;
          font-size: 12px;
          line-height: 14px;
          color: rgba(157, 161, 165, 1);
        }
      `}</style>
    </div>
  );
};

export default UserClusterMap;
