import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Stack,
  Chip,
  Collapse,
  Alert,
  useTheme,
  Skeleton,
  Button,
} from "@mui/material";
import {
  Star,
  ErrorOutline,
  LocalOffer as TagIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  EmojiEvents as AwardIcon,
} from "@mui/icons-material";
import axios from "axios";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
const TopTours = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollPositionRef = useRef(0);
  const lastTimeRef = useRef(0);
  const SCROLL_SPEED = 30;
  const cascadeDown = keyframes`
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:8080/api/favorite-tours",
        );
        const sortedTours = response.data.sort(
          (a, b) => b.averageRating - a.averageRating,
        );
        setTours(sortedTours);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setError("Không thể tải dữ liệu tour. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    if (!scrollRef.current || loading) return;

    let animationFrameId = null;

    const scroll = (timestamp) => {
      if (!scrollRef.current) return;
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!isHovered) {
        scrollPositionRef.current += (SCROLL_SPEED * deltaTime) / 1000;
        scrollRef.current.scrollTop = scrollPositionRef.current;
        if (
          scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
          scrollRef.current.scrollHeight / 2
        ) {
          scrollPositionRef.current = 0;
          scrollRef.current.scrollTop = 0;
        }
      } else {
        scrollPositionRef.current = scrollRef.current.scrollTop;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [loading, isHovered]);

  const formatRating = (rating) => Number(rating).toFixed(1);

  const getBadgeInfo = (rating) => {
    if (rating >= 4.5)
      return { text: "Xuất sắc", color: "#2ecc71", bgColor: "#e8f5e9" };
    if (rating >= 4.0)
      return { text: "Rất tốt", color: "#3498db", bgColor: "#e3f2fd" };
    if (rating >= 3.5)
      return { text: "Tốt", color: "#f1c40f", bgColor: "#fff3e0" };
    if (rating >= 3.0)
      return { text: "Khá", color: "#e67e22", bgColor: "#fff3e0" };
    return { text: "Trung bình", color: "#e74c3c", bgColor: "#ffebee" };
  };

  const LoadingSkeleton = () => (
    <Stack spacing={2}>
      {[1, 2, 3].map((item) => (
        <Card key={item} elevation={0} sx={styles.skeletonCard}>
          <CardContent>
            <Box sx={styles.cardHeader}>
              <Stack spacing={1} width="70%">
                <Skeleton variant="text" width="80%" height={28} />
                <Box display="flex" gap={1}>
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={24}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={24}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </Stack>
              <Skeleton
                variant="rectangular"
                width={50}
                height={50}
                sx={{ borderRadius: 1 }}
              />
            </Box>
            <Skeleton
              variant="rectangular"
              height={8}
              sx={{ mt: 2, borderRadius: "4px" }}
            />
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
  const handleViewDetail = (tourId) => {
    if (!tourId) {
      console.error("Tour ID is missing");
      return;
    }
    navigate(`/tour-details/${tourId}`);
  };
  const TourCard = ({ tour, index }) => {
    const badgeInfo = getBadgeInfo(tour.averageRating);
    const isExpanded = expandedId === tour.tourId;

    const RankBadge = () => {
      if (index === 0)
        return (
          <Chip
            icon={<AwardIcon />}
            label="TOP 1"
            color="primary"
            size="small"
            sx={styles.rankChip1}
          />
        );
      if (index === 1)
        return (
          <Chip
            icon={<AwardIcon />}
            label="TOP 2"
            color="secondary"
            size="small"
            sx={styles.rankChip2}
          />
        );
      if (index === 2)
        return (
          <Chip
            icon={<AwardIcon />}
            label="TOP 3"
            color="success"
            size="small"
            sx={styles.rankChip3}
          />
        );
      return null;
    };

    return (
      <Card
        elevation={0}
        sx={{
          ...styles.card,
          animation: `${cascadeDown} 0.5s ease-out forwards`,
          animationDelay: `${index * 0.2}s`,
          opacity: 0,
        }}
        onClick={() => setExpandedId(isExpanded ? null : tour.tourId)}
      >
        {index < 3 && (
          <Box sx={styles.rankBadgeContainer}>
            <RankBadge />
          </Box>
        )}
        <CardContent>
          <Box sx={styles.cardHeader}>
            <Stack spacing={1} width="100%">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={styles.tourName}>
                  {tour.tourName}
                </Typography>
                <Box sx={styles.ratingBox}>
                  <Typography variant="h5" sx={styles.ratingText}>
                    {formatRating(tour.averageRating)}
                  </Typography>
                  <Star sx={{ color: "#ffd700", fontSize: 20 }} />
                </Box>
              </Box>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<TagIcon sx={{ fontSize: 16 }} />}
                  label={badgeInfo.text}
                  size="small"
                  sx={{
                    color: badgeInfo.color,
                    bgcolor: badgeInfo.bgColor,
                    fontWeight: 600,
                    "& .MuiChip-icon": {
                      color: badgeInfo.color,
                    },
                  }}
                />
                <Chip
                  icon={<TimeIcon sx={{ fontSize: 16 }} />}
                  label={`${tour.duration || "3"} ngày`}
                  size="small"
                  sx={styles.infoChip}
                />
                <Chip
                  icon={<GroupIcon sx={{ fontSize: 16 }} />}
                  label={`${tour.groupSize || "20"} người`}
                  size="small"
                  sx={styles.infoChip}
                />
              </Stack>
            </Stack>
          </Box>

          <LinearProgress
            variant="determinate"
            value={(tour.averageRating / 5) * 100}
            sx={{
              ...styles.progressBar,
              "& .MuiLinearProgress-bar": {
                backgroundColor: badgeInfo.color,
              },
            }}
          />

          <Collapse in={isExpanded}>
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                • {tour.totalReviews || "150"} đánh giá
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Giá từ {tour.price || "2,990,000"}đ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Khởi hành từ {tour.startLocation || "Hà Nội"}
              </Typography>
              <Button onClick={() => handleViewDetail(tour.tourId)}>
                Xem chi tiết
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      ref={scrollRef}
      sx={{
        ...styles.container,
        height: "600px",
        overflowY: "hidden",
        "&:hover": {
          overflowY: "auto", // Show scrollbar on hover
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
            "&:hover": {
              background: "#555",
            },
          },
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {error && (
        <Alert
          severity="error"
          icon={<ErrorOutline fontSize="inherit" />}
          sx={styles.errorAlert}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Stack spacing={1.5}>
          {/* Duplicate tours để tạo hiệu ứng cuộn vô tận */}
          {[...tours, ...tours].map((tour, index) => (
            <TourCard
              key={`${tour.tourId}-${index}`}
              tour={tour}
              index={index % tours.length}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

const styles = {
  container: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
      borderColor: "primary.main",
    },
    position: "relative",
  },
  skeletonCard: {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 3,
  },
  cardHeader: {
    position: "relative",
    mb: 2,
  },
  rankBadgeContainer: {
    position: "absolute",
    top: -10,
    left: 10,
    zIndex: 10,
  },
  rankChip1: {
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  rankChip2: {
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  rankChip3: {
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  tourName: {
    fontWeight: 700,
    fontSize: "1.1rem",
    color: "text.primary",
    lineHeight: 1.2,
  },
  infoChip: {
    bgcolor: "action.selected",
    color: "text.secondary",
    "& .MuiChip-icon": {
      color: "text.secondary",
    },
  },
  ratingBox: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    p: 1,
    bgcolor: "action.hover",
    borderRadius: 2,
  },
  ratingText: {
    fontWeight: 700,
    color: "text.primary",
    fontSize: "1.25rem",
  },
  progressBar: {
    height: 6,
    borderRadius: "3px",
    bgcolor: "action.hover",
    mt: 2,
    "& .MuiLinearProgress-bar": {
      borderRadius: "3px",
      transition: "transform 0.4s ease",
    },
  },
  errorAlert: {
    mb: 2,
    "& .MuiAlert-icon": {
      color: "error.main",
    },
  },
};

export default TopTours;
