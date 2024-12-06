import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Container,
  Stack,
  Skeleton,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TravelExplore as TravelExploreIcon,
  Info as InfoIcon,
  DateRange as DateRangeIcon,
  Phone as PhoneIcon,
  Facebook as FacebookIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import axios from "axios";
import TourTimeline from "./TourTimeline";
import NavHeader from "../navbar/NavHeader";

const TourScheduleComponent = () => {
  const [tours, setTours] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTours, setSelectedTours] = useState([]);
  const [selectedTourCustomers, setSelectedTourCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [tourGuideId, setTourGuideId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const userString = sessionStorage.getItem("user");

    if (userString) {
      try {
        const user = JSON.parse(userString);
        setTourGuideId(user.userId);
      } catch (parseError) {
        console.error("Error parsing user from session storage:", parseError);
        setError("Không thể tải thông tin người dùng");
        setIsLoading(false);
      }
    } else {
      setError("Vui lòng đăng nhập");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchTourSchedule = async () => {
      if (!tourGuideId) return;

      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/tour-guides/schedule/${tourGuideId}`,
        );
        setTours(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching tour schedule:", err);
        setError("Không thể tải lịch trình. Vui lòng thử lại sau.");
        setIsLoading(false);
      }
    };

    fetchTourSchedule();
  }, [tourGuideId]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePhoneClick = (phone) => {
    window.open(`tel:+${phone}`, "_self");
  };

  const getTourCount = (date) => {
    return tours.filter((tour) => {
      const startDate = new Date(tour.startDate);
      return startDate.toDateString() === date.toDateString();
    }).length;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const matchedTours = tours.filter((tour) => {
      const start = new Date(tour.startDate);
      return start.toDateString() === date.toDateString();
    });
    setSelectedTours(matchedTours);

    if (matchedTours.length === 1) {
      setSelectedTourCustomers(matchedTours[0].customers || []);
    } else {
      setSelectedTourCustomers([]);
    }
  };

  const renderCustomerStatus = (status) => {
    switch (status) {
      case "CHECKED_IN":
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Đã Check-in"
            color="success"
            variant="outlined"
            size="small"
            sx={{
              "& .MuiChip-icon": {
                color: theme.palette.success.main,
              },
            }}
          />
        );
      case "NOT_CHECKED_IN":
        return (
          <Chip
            icon={<WarningIcon />}
            label="Chưa Check-in"
            color="warning"
            variant="outlined"
            size="small"
            sx={{
              "& .MuiChip-icon": {
                color: theme.palette.warning.main,
              },
            }}
          />
        );
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const tourCount = getTourCount(date);
      if (tourCount > 0) {
        return (
          <Badge
            badgeContent={tourCount}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.7rem",
                minWidth: "16px",
                height: "16px",
                padding: "0 4px",
              },
            }}
          >
            <Box sx={{ width: 24, height: 24 }} />
          </Badge>
        );
      }
    }
    return null;
  };

  const renderEmptyState = () => (
    <Box
      elevation={3}
      sx={{
        p: 4,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        bgcolor: theme.palette.grey[50],
      }}
    >
      <DateRangeIcon
        sx={{
          fontSize: 48,
          color: theme.palette.grey[400],
          mb: 2,
        }}
      />
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
        Chưa có chuyến đi nào được chọn
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 300 }}>
        Vui lòng chọn một ngày trên lịch để xem chi tiết chuyến đi
      </Typography>
    </Box>
  );
  const scrollbarStyles = `
  /* Custom Scrollbar Styles */
  .custom-scrollbar {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: ${theme.palette.primary.main}20 transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: ${theme.palette.primary.main}40;
    border-radius: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: ${theme.palette.primary.main}60;
  }
`;
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          sx={{
            "& .MuiAlert-icon": {
              fontSize: "2rem",
            },
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, height: "calc(100vh - 64px)" }}>
      <style>
        {`
        .react-calendar {
          width: 100%;
          max-width: 100%;
          background: white;
          border: none;
          border-radius: 12px;
          box-shadow: none;
          font-family: inherit;
          line-height: 1.125em;
        }
        .react-calendar__tile {
          padding: 1em 0.5em;
          position: relative;
          height: 75px;
        }
        .react-calendar__tile--active {
          background: ${theme.palette.primary.main} !important;
          color: white !important;
          border-radius: 8px !important;
        }
        .react-calendar__tile--now {
          background: ${theme.palette.primary.light}20 !important;
          border-radius: 8px;
        }
        .react-calendar__month-view__days__day--weekend {
          color: ${theme.palette.error.light};
        }
        .react-calendar__navigation button {
          font-size: 1.2rem;
          padding: 1em;
        }
        .react-calendar__navigation {
          margin-bottom: 1em;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: ${theme.palette.primary.light}40;
          border-radius: 8px;
        }
          ${scrollbarStyles}

      `}
      </style>
      {/* <NavHeader textColor="black" /> */}
      <Grid
        container
        spacing={2}
        sx={{ height: "calc(100vh - 100px)", width: "100%" }}
      >
        <Grid item xs={12} md={3} sx={{ height: "100%" }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              bgcolor: theme.palette.background.paper,
              overflow: "hidden",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 3, flexShrink: 0 }}
            >
              <EventIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" color="primary">
                Lịch Trình Tour
              </Typography>
              <Tooltip title="Nhấp vào ngày để xem chi tiết">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <Box className="custom-scrollbar-calendar">
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={400}
                  sx={{ borderRadius: 3 }}
                />
              ) : (
                <Calendar
                  onClickDay={handleDateClick}
                  tileContent={tileContent}
                  locale="vi-VN"
                />
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {isLoading ? (
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                width: "100%",
                borderRadius: 3,
              }}
            >
              <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            </Paper>
          ) : selectedTours.length > 0 ? (
            // <Paper
            //   elevation={2}
            //   sx={{
            //     p: 3,
            //     height: '100%',
            //       width:'100%',
            //     borderRadius: 3,
            //     bgcolor: theme.palette.background.paper
            //   }}
            // >
            <Box
              className="custom-scrollbar"
              sx={{ flexGrow: 1, overflow: "auto" }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 3 }}
              >
                <TravelExploreIcon color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Chi tiết chuyến đi ngày {selectedDate.toLocaleDateString()}
                </Typography>
              </Stack>
              <Box
                className="custom-scrollbar"
                sx={{ flexGrow: 1, overflow: "auto" }}
              >
                <TableContainer
                  sx={{
                    width: "100%",
                    mb: 3,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                          Tên Tour
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                          Ngày Bắt Đầu
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                          Ngày Kết Thúc
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "bold", color: "white" }}
                        >
                          Số Khách
                        </TableCell>
                        {/* <TableCell align="center" sx={{ fontWeight: 'bold' }}>Số Khách</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedTours.map((tour) => (
                        <TableRow
                          key={tour.departureId}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{tour.tourName}</TableCell>
                          <TableCell>
                            <Chip
                              label={formatDateTime(tour.startDate)}
                              color="primary"
                              variant="outlined"
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={formatDateTime(tour.endDate)}
                              color="secondary"
                              variant="outlined"
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color={
                                tour.customers.length >= tour.maxParticipants
                                  ? "error"
                                  : "success"
                              }
                            >
                              {tour.customers.length}/{tour.maxParticipants}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {selectedTourCustomers.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />

                    <Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ mb: 3 }}
                      >
                        <PersonIcon color="primary" sx={{ fontSize: 28 }} />
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                        >
                          Danh Sách Khách Hàng
                        </Typography>
                      </Stack>
                      {/* Summary Section */}
                      <Box
                        sx={{
                          mt: 3,
                          p: 2,
                          bgcolor: theme.palette.grey[50],
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Tổng số khách
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="primary"
                              >
                                {selectedTourCustomers.length}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Đã check-in
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="success.main"
                              >
                                {
                                  selectedTourCustomers.filter(
                                    (c) => c.checkinStatus === "CHECKED_IN",
                                  ).length
                                }
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Chưa check-in
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="warning.main"
                              >
                                {
                                  selectedTourCustomers.filter(
                                    (c) => c.checkinStatus === "NOT_CHECKED_IN",
                                  ).length
                                }
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Tỷ lệ check-in
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="info.main"
                              >
                                {Math.round(
                                  (selectedTourCustomers.filter(
                                    (c) => c.checkinStatus === "CHECKED_IN",
                                  ).length /
                                    selectedTourCustomers.length) *
                                    100,
                                )}
                                %
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                      <Box
                        className="custom-scrollbar"
                        sx={{ flexGrow: 1, overflow: "auto" }}
                      ></Box>
                      <TableContainer
                        sx={{
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Table size={isMobile ? "small" : "medium"}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{ fontWeight: "bold", color: "white" }}
                              >
                                Họ Tên
                              </TableCell>
                              {!isMobile && (
                                <TableCell
                                  sx={{ fontWeight: "bold", color: "white" }}
                                >
                                  Email
                                </TableCell>
                              )}
                              <TableCell
                                sx={{ fontWeight: "bold", color: "white" }}
                              >
                                Số điện thoại
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", color: "white" }}
                              >
                                Ngày Đặt
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", color: "white" }}
                              >
                                Trạng Thái
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedTourCustomers.map((customer) => (
                              <TableRow
                                key={customer.customerId}
                                hover
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                  },
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body2" fontWeight={500}>
                                    {customer.fullName}
                                  </Typography>
                                </TableCell>
                                {!isMobile && (
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {customer.email}
                                    </Typography>
                                  </TableCell>
                                )}
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      display: "flex", // Sử dụng Flexbox
                                      alignItems: "center", // Căn giữa theo chiều dọc
                                    }}
                                  >
                                    {customer.phone}
                                    <Tooltip title="Gọi ngay">
                                      <IconButton
                                        onClick={() =>
                                          handlePhoneClick(customer.phone)
                                        }
                                        color="primary"
                                        sx={{
                                          backgroundColor: "white",
                                          borderRadius: "50%",
                                          boxShadow: 2,
                                          width: 20,
                                          height: 20,
                                          marginLeft: 1,
                                          "&:hover": {
                                            boxShadow: 4,
                                          },
                                        }}
                                      >
                                        <PhoneIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {formatDateTime(customer.bookingDate)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {renderCustomerStatus(customer.checkinStatus)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          ) : (
            // </Paper>
            renderEmptyState()
          )}
        </Grid>
        <Grid item xs={12} md={3} sx={{ height: "100%", width: "100%" }}>
          <Box
            elevation={2}
            sx={{
              p: 3,
              height: "100%",
              width: "100%",
              borderRadius: 3,
              bgcolor: theme.palette.background.paper,
              display: isLoading ? "none" : "flex",
              flexDirection: "column",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 3, flexShrink: 0 }}
            >
              <DateRangeIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold" color="primary">
                Hành trình tour sắp tới của bạn
              </Typography>
            </Stack>
            <Box
              className="custom-scrollbar"
              sx={{ flexGrow: 1, overflow: "auto" }}
            >
              <TourTimeline tours={tours} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TourScheduleComponent;
