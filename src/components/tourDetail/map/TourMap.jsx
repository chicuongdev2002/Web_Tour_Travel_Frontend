import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import Modal from "../modal/Modal";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Tạo biểu tượng marker tùy chỉnh
const flameIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      width: 40px;
      height: 40px;
      position: relative;
      animation: flame 1.5s infinite;
    ">
     <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
        <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0ZM12 13C9.24 13 7 10.76 7 8C7 5.24 9.24 3 12 3C14.76 3 17 5.24 17 8C17 10.76 14.76 13 12 13Z" 
              fill="#FF0000"/>
        <circle cx="12" cy="8" r="3" fill="white"/>
      </svg>
    </div>
    <style>
      @keyframes flame {
        0%, 100% {
          transform: translateY(0) scale(1);
        }
        50% {
          transform: translateY(-2px) scale(1.1);
        }
      }
      .custom-marker {
        transform: translate(-20px, -20px);
      }
    </style>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const TourMap = ({ destinations = [] }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);

  // Lấy tọa độ cho các điểm đến
  useEffect(() => {
    const getCoordinates = async () => {
      if (!destinations.length) {
        setLoading(false);
        return;
      }

      try {
        const results = [];

        for (const dest of destinations) {
          try {
            const query = encodeURIComponent(`${dest.province}, Vietnam`);
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
              {
                headers: {
                  "Accept-Language": "vi",
                  "User-Agent": "TourWebsite/1.0",
                },
              },
            );

            const data = await response.json();

            if (data && data.length > 0) {
              results.push({
                ...dest,
                coordinates: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
              });
            }
          } catch (error) {
            console.error(
              `Error fetching coordinates for ${dest.province}:`,
              error,
            );
          }
        }

        setLocations(results);

        if (results.length >= 2) {
          await getRoutes(results);
        }
      } catch (error) {
        console.error("Error in getCoordinates:", error);
      } finally {
        setLoading(false);
      }
    };

    getCoordinates();
  }, [destinations]);

  const getRoutes = async (locationPoints) => {
    const routeSegments = [];

    for (let i = 0; i < locationPoints.length - 1; i++) {
      const start = locationPoints[i].coordinates;
      const end = locationPoints[i + 1].coordinates;

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
        );

        const data = await response.json();

        if (data.code === "Ok" && data.routes[0]) {
          routeSegments.push({
            geometry: data.routes[0].geometry.coordinates.map((coord) => [
              coord[1],
              coord[0],
            ]),
            distance: data.routes[0].distance,
            duration: data.routes[0].duration,
          });
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    }

    setRoutes(routeSegments);
  };

  const RouteDisplay = () => {
    const map = useMap();

    useEffect(() => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });

      routes.forEach((route, index) => {
        const polyline = L.polyline(route.geometry, {
          color: "#2196F3",
          weight: 4,
          opacity: 0.8,
        }).addTo(map);

        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationHours = (route.duration / 3600).toFixed(1);

        polyline.bindTooltip(
          `Khoảng cách: ${distanceKm}km<br>Thời gian: ${durationHours} giờ`,
          { permanent: false, sticky: true },
        );
      });
    }, [map, routes]);

    return null;
  };

  const FitBounds = () => {
    const map = useMap();
    useEffect(() => {
      if (locations.length > 0) {
        const bounds = L.latLngBounds(locations.map((loc) => loc.coordinates));
        map.fitBounds(bounds);
      }
    }, [locations, map]);
    return null;
  };

  if (loading) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px 16px",
          borderRadius: "4px",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <h2
          style={{
            marginRight: "10px",
            fontFamily: "Arial, sans-serif",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Xem bản đồ
        </h2>
        <FaMapMarkerAlt style={{ fontSize: "24px", color: "#FF4081" }} />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div style={{ height: "400px", width: "100%" }}>
          <MapContainer
            center={[16.0469, 108.2069]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <FitBounds />
            <RouteDisplay />

            {locations.map((location, index) => (
              <Marker
                key={index}
                position={location.coordinates}
                icon={flameIcon}
              >
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -30]}
                  className="location-tooltip"
                >
                  {location.name}
                </Tooltip>
                <Popup>
                  <div>
                    <h3>{location.name}</h3>
                    <h3>{location.province}</h3>
                    {location.description && <p>{location.description}</p>}
                    {index < locations.length - 1 && routes[index] && (
                      <p>
                        Đến điểm tiếp theo:
                        <br />
                        Khoảng cách:{" "}
                        {(routes[index].distance / 1000).toFixed(1)}km
                        <br />
                        Thời gian: {(routes[index].duration / 3600).toFixed(
                          1,
                        )}{" "}
                        giờ
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </Modal>
    </div>
  );
};

export default TourMap;
