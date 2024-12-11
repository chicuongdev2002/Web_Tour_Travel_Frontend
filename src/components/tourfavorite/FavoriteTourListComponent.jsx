import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  CircularProgress,
  Typography,
  Box,
  Paper,
  Fade,
  Pagination,
  Stack,
  Card,
  CardContent,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  Timer as TimerIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import TourCard from "../tourCard/TourCard";
import axiosInstance from "../../config/axios";
import axios from "axios";
import { getFavoriteTour } from "../../functions/getFavoriteTour";

const FavoriteTourStatistics = ({ tours }) => {
  const totalTours = tours.length;
  const totalDestinations = [
    ...new Set(tours.map((tour) => tour.startLocation)),
  ].length;
  const totalTourTypes = [...new Set(tours.map((tour) => tour.tourType))]
    .length;

  const statisticItems = [
    {
      icon: <FavoriteIcon fontSize="large" />,
      value: totalTours,
      label: "Tổng số tour yêu thích",
      color: "primary.main",
    },
    {
      icon: <LocationIcon fontSize="large" />,
      value: totalDestinations,
      label: "Điểm đến khác nhau",
      color: "secondary.main",
    },
    {
      icon: <TimerIcon fontSize="large" />,
      value: totalTourTypes,
      label: "Loại tour khác nhau",
      color: "info.main",
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{
        mb: 4,
        "& .MuiCard-root:hover": {
          transform: "scale(1.05)",
          transition: "transform 0.3s ease-in-out",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        },
      }}
    >
      {statisticItems.map((item, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card
            variant="outlined"
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ color: item.color }}
              >
                {item.icon}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const FavoriteTourListComponent = () => {
  const navigate = useNavigate();
  const [dataCard, setDataCard] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const fetchFavoriteTours = async (currentPage) => {
    setLoading(true);
    try {
      const response = await getFavoriteTour(user.userId);
      const data = response.data;
      if (data) {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = data.slice(startIndex, endIndex);

        setDataCard(paginatedData);
        setTotalPages(Math.ceil(data.length / pageSize));
      } else {
        setDataCard([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching favorite tours:", error);
      setDataCard([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTour = () => {
    navigate("/search-page");
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchFavoriteTours(page);
    }
  }, [page]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Typography
                variant="h4"
                sx={{
                  textAlign: "left",
                  color: "primary.main",
                  fontWeight: "bold",
                }}
              >
                Tour Yêu Thích
              </Typography>
              <Tooltip title="Thêm tour mới vào danh sách yêu thích">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddTour}
                >
                  Khám phá tour mới ngay
                </Button>
              </Tooltip>
            </Stack>

            {dataCard.length > 0 && <FavoriteTourStatistics tours={dataCard} />}

            {dataCard.length === 0 ? (
              <Fade in timeout={800}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 6,
                    textAlign: "center",
                    borderRadius: 4,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="h5" gutterBottom color="primary">
                    Chưa có tour yêu thích
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Hãy thêm các tour bạn yêu thích vào danh sách này.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddTour}
                  >
                    Khám Phá Tour
                  </Button>
                </Paper>
              </Fade>
            ) : (
              <Grid
                container
                spacing={3}
                sx={{
                  "& > .MuiGrid-item": {
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                    },
                  },
                }}
              >
                {dataCard.map((tour, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={tour.tourId}>
                    <Fade in timeout={500 + index * 100}>
                      <Box>
                        <TourCard
                          tour={{
                            tourId: tour.tourId,
                            image: tour.imageUrl,
                            title: tour.tourName,
                            departureCity: tour.startLocation,
                            tourType: tour.tourType,
                            startDate: tour.startDate,
                            duration: `${tour.duration}N${tour.duration - 1}Đ`,
                            originalPrice: "8,490,000",
                            availableSeats: tour.availableSeats,
                            discountedPrice: tour.price,
                            favorite: true,
                          }}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
            {dataCard.length > 0 && (
              <Box display="flex" justifyContent="center" mt={6}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                  siblingCount={0}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "primary.light",
                        color: "white",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default FavoriteTourListComponent;
