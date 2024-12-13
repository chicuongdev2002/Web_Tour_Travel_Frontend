import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Container,
  IconButton,
  Tooltip,
  Zoom,
  Rating,
} from "@mui/material";
import {
  Favorite,
  AccessTime,
  People,
  FavoriteBorder,
  LocationOn,
} from "@mui/icons-material";
import axios from "axios";
import { getAllFavoriteTour } from "../../functions/getFavoriteTour";

const CARD_WIDTH = 100; // Slightly wider cards
const ANIMATION_DURATION = 40000; // Slower animation for smoother effect

const TourListFavoriteComponent = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getAllFavoriteTour();
        console.log(response);
        const duplicatedTours = [...response.data, ...response.data];
        setTours(duplicatedTours);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách tour. Vui lòng thử lại sau.");
        setLoading(false);
        console.error("Error fetching tours:", err);
      }
    };

    fetchTours();
  }, []);

  const handleBookTour = (tourId) => {
    console.log(`Đặt tour với ID: ${tourId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Đang tải danh sách tour...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{
            borderRadius: 2,
            animation: "fadeIn 0.5s ease-in",
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const containerStyles = {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: 0,
      width: "10px", // Wider gradient
      height: "100%",
      zIndex: 2,
    },
    "&::before": {
      left: 0,
      background:
        "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))",
    },
    "&::after": {
      right: 0,
      background:
        "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))",
    },
  };

  const sliderStyles = {
    display: "flex",
    gap: "24px", // Increased gap
    padding: "24px",
    animation: isPaused
      ? "none"
      : `scroll ${ANIMATION_DURATION}ms linear infinite`,
    "&:hover": {
      animationPlayState: "paused",
    },
    "@keyframes scroll": {
      "0%": { transform: "translateX(0)" },
      "100%": {
        transform: `translateX(-${CARD_WIDTH * (tours.length / 2) + 24 * (tours.length / 2)}px)`,
      },
    },
  };

  const cardStyles = {
    width: CARD_WIDTH,
    flexShrink: 0,
    height: "auto",
    display: "flex",
    flexDirection: "column",
    borderRadius: 3,
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "visible", // Allow shadow to overflow
    "&:hover": {
      transform: "translateY(-12px) scale(1.02)",
      boxShadow: "0 16px 48px -12px rgba(0,0,0,0.25)",
    },
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            position: "relative",
            display: "inline-block",
            mb: 4,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "60%",
              height: 4,
              backgroundColor: "primary.main",
              borderRadius: 2,
            },
          }}
        >
          Tour Du Lịch Nổi Bật
        </Typography>

        <Box sx={containerStyles} ref={containerRef}>
          <Box
            sx={sliderStyles}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {tours.map((tour, index) => (
              <Card
                key={`${tour.tourId}-${index}`}
                sx={cardStyles}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Box
                  sx={{
                    overflow: "hidden",
                    position: "relative",
                    borderRadius: "12px 12px 0 0",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100px"
                    image={tour.imageUrl || "/api/placeholder/400/250"}
                    alt={tour.tourName}
                    sx={{
                      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "scale(1.15)",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.3)",
                      opacity: hoveredCard === index ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      icon={<Favorite sx={{ color: "#fff !important" }} />}
                      label={`${tour.likeCount || 0} lượt thích`}
                      sx={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "white",
                        backdropFilter: "blur(4px)",
                        "& .MuiChip-icon": {
                          color: "white",
                        },
                      }}
                    />
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LocationOn color="primary" sx={{ mr: 1 }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontWeight: 500,
                      }}
                    >
                      {tour.startLocation || "Việt Nam"}
                    </Typography>
                  </Box>

                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tour.tourName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      height: "40px",
                      lineHeight: 1.6,
                    }}
                  >
                    {tour.tourDescription}
                  </Typography>

                  <Box
                    sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}
                  >
                    <Tooltip title="Thời gian tour" TransitionComponent={Zoom}>
                      <Chip
                        icon={<AccessTime />}
                        label={`${tour.duration} ngày`}
                        size="small"
                        variant="outlined"
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "primary.light",
                            color: "white",
                            "& .MuiChip-icon": {
                              color: "white",
                            },
                          },
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      title="Số chỗ còn trống"
                      TransitionComponent={Zoom}
                    >
                      <Chip
                        icon={<People />}
                        label={`Còn ${tour.availableSeats} chỗ`}
                        size="small"
                        color={tour.availableSeats < 5 ? "error" : "primary"}
                        variant="outlined"
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor:
                              tour.availableSeats < 5
                                ? "error.light"
                                : "primary.light",
                            color: "white",
                            "& .MuiChip-icon": {
                              color: "white",
                            },
                          },
                        }}
                      />
                    </Tooltip>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h5"
                      color="primary"
                      sx={{
                        fontWeight: 700,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {tour.price.toLocaleString()} VND
                    </Typography>
                    <Rating
                      value={tour.averageRating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleBookTour(tour.tourId)}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      background:
                        "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 24px rgba(33,150,243,0.3)",
                      },
                    }}
                  >
                    Đặt Tour Ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default TourListFavoriteComponent;
