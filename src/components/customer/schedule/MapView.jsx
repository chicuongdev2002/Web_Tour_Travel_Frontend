import React, { useMemo } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";

// Constants for Vietnam boundaries
const VIETNAM_BOUNDS = {
  northEast: [23.393395, 109.464478],
  southWest: [8.415617, 102.144571],
};

// Predefined colors for better performance
const TOUR_COLORS = {
  primary: "#1976d2", // blue
  secondary: "#9c27b0", // purple
  success: "#2e7d32", // green
  warning: "#ed6c02", // orange
  info: "#0288d1", // light blue
  purple: "#7b1fa2", // deep purple
};

// Create custom icon using Leaflet's divIcon
const createCustomIcon = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Color interpolation function
const interpolateColor = (color1, color2, ratio) => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * ratio)
    .toString(16)
    .padStart(2, "0");
  const g = Math.round(g1 + (g2 - g1) * ratio)
    .toString(16)
    .padStart(2, "0");
  const b = Math.round(b1 + (b2 - b1) * ratio)
    .toString(16)
    .padStart(2, "0");

  return `#${r}${g}${b}`;
};

const GradientPolyline = React.memo(({ positions, startColor, endColor }) => {
  const segments = useMemo(() => {
    const colors = positions.map((_, index) =>
      interpolateColor(startColor, endColor, index / (positions.length - 1)),
    );

    return positions.slice(1).map((_, index) => ({
      positions: [positions[index], positions[index + 1]],
      color: colors[index],
    }));
  }, [positions, startColor, endColor]);

  return segments.map((segment, index) => (
    <Polyline
      key={index}
      positions={segment.positions}
      color={segment.color}
      weight={3}
      opacity={0.7}
      smoothFactor={1}
    />
  ));
});

const MapView = ({ destinations = [], routes = {} }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Memoized markers and routes
  const mapElements = useMemo(
    () => ({
      markers: destinations.map((dest, index) => ({
        ...dest,
        icon: createCustomIcon(
          Object.values(TOUR_COLORS)[index % Object.keys(TOUR_COLORS).length],
        ),
      })),
      routeLines: Object.entries(routes)
        .map(([tourName, tourRoutes], tourIndex) =>
          tourRoutes.map((route, routeIndex) => ({
            key: `${tourName}-${routeIndex}`,
            positions: route,
            startColor:
              Object.values(TOUR_COLORS)[
                tourIndex % Object.keys(TOUR_COLORS).length
              ],
            endColor:
              Object.values(TOUR_COLORS)[
                (tourIndex + 1) % Object.keys(TOUR_COLORS).length
              ],
          })),
        )
        .flat(),
    }),
    [destinations, routes],
  );

  return (
    <Card
      elevation={3}
      sx={{
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="h2">
            Bản đồ du lịch Việt Nam
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {destinations.length} điểm đến
          </Typography>
        </Box>
      </Box>

      <Box sx={{ position: "relative", height: 600 }}>
        <MapContainer
          key="map-container"
          bounds={[VIETNAM_BOUNDS.southWest, VIETNAM_BOUNDS.northEast]}
          maxBounds={[VIETNAM_BOUNDS.southWest, VIETNAM_BOUNDS.northEast]}
          scrollWheelZoom={true}
          minZoom={5}
          maxZoom={12}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            subdomains={["a", "b", "c", "d"]}
            maxZoom={12}
          />
          <ZoomControl position="bottomright" />

          {mapElements.routeLines.map((route) => (
            <GradientPolyline
              key={route.key}
              positions={route.positions}
              startColor={route.startColor}
              endColor={route.endColor}
            />
          ))}

          {mapElements.markers.map((dest, index) => (
            <Marker
              key={`marker-${dest.name}-${index}`}
              position={dest.coordinates}
              icon={dest.icon}
            >
              <Popup>
                <Box sx={{ minWidth: 200, p: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      borderBottom: 1,
                      borderColor: "divider",
                      pb: 1,
                      mb: 1,
                    }}
                  >
                    {dest.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor:
                          Object.values(TOUR_COLORS)[
                            index % Object.keys(TOUR_COLORS).length
                          ],
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {dest.tourName}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: "grey.50", p: 1, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Khởi hành: {formatDate(dest.startDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Kết thúc: {formatDate(dest.endDate)}
                    </Typography>
                  </Box>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Card>
  );
};

export default React.memo(MapView);
