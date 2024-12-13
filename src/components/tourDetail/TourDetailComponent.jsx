import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Paper,
  Stack,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocationOn as LocationOnIcon,
  TravelExplore as TravelExploreIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SliderPaging from "../slider/SliderPaging";
import TourCalendar from "./Calendar/TourCalendar";
import DepartureDates from "./Calendar/DepartureDates";
import ItineraryDetail from "./InfomaitionTour/ItineraryDetail";
import TourMap from "./map/TourMap";
import ReviewComponent from "./review/ReviewComponent";
import imageBasic from "../../assets/404.png";
import { deleteData } from "../../functions/deleteData";
import { UPDATE_TOUR_STATUS } from "../../config/host";
import TopTours from "../tour/TopTours";
import { deleteTour } from "../../functions/deleteTour";

const TourDetailComponent = ({ tourData }) => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDeparture, setSelectedDeparture] = useState(
    tourData.departures.find((d) => {
      debugger;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const inputDateObj = new Date(d.startDate);
      return (
        inputDateObj > new Date(currentDate.setDate(currentDate.getDate() + 3))
      );
    }),
  );
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);

  // Memoized calculations to improve performance
  const averageRating = useMemo(
    () =>
      tourData.reviews.reduce((acc, review) => acc + review.rating, 0) /
      tourData.reviews.length,
    [tourData.reviews],
  );

  // Enhanced price formatting with localization
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  const participantTypeTranslation = {
    ADULTS: "Người lớn (Trên 12 tuổi)",
    CHILDREN: "Trẻ em (5-11 tuổi)",
    ELDERLY: "Người cao tuổi (Trên 60 tuổi)",
  };

  const goToBooking = () => {
    const bookingState = {
      ...tourData,
      departures: [selectedDeparture],
    };

    navigate(storedUser ? "/booking" : "/login-register", {
      state: bookingState,
    });
  };

  const goToUpdateTour = () => {
    console.log("tourData", tourData);
    navigate(`/update-tour/${tourData.tourId}`, { state: tourData });
  };

  const deleteTourById = async () => {
    try {
      // const result = await deleteData(UPDATE_TOUR_STATUS, tourData.tourId);
      const result = await deleteTour( tourData.tourId,storedUser.userId);
      setDeleteStatus(result ? "success" : "error");
      if (result) {
        setTimeout(() => navigate("/tour-list"), 1500);
      }
    } catch (error) {
      console.error("Tour deletion error:", error);
      setDeleteStatus("error");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={8}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              mb: 3,
              boxShadow: 3,
              borderRadius: 2,
              overflow: "hidden",
              height: isMobile ? "400px" : "600px",
            }}
          >
            <SliderPaging
              images={
                tourData.images.length
                  ? tourData.images.map((img) => img.imageUrl)
                  : [imageBasic]
              }
              mainImgDimension={{
                width: "100%",
                height: isMobile ? "auto" : "500px",
              }}
              thumbImgDimension={{ width: 70, height: 70 }}
            />
          </Box>

          {/* Enhanced Description Card */}
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: 3 },
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  color="primary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <TravelExploreIcon /> Trải nghiệm của bạn
                </Typography>

                <Typography variant="body1" paragraph>
                  {isDescriptionExpanded
                    ? tourData.tourDescription
                    : `${tourData.tourDescription.substring(0, 250)}...`}
                </Typography>

                <Button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  color="primary"
                  variant="outlined"
                  endIcon={
                    isDescriptionExpanded ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )
                  }
                  sx={{ alignSelf: "center" }}
                >
                  {isDescriptionExpanded ? "Thu gọn" : "Xem chi tiết"}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Tour Map Section with Enhanced Design */}
          <Card
            variant="outlined"
            sx={{
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: 3 },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                color="primary"
                display="flex"
                alignItems="center"
                gap={1}
                gutterBottom
              >
                <LocationOnIcon /> Bản đồ lộ trình
              </Typography>
              <TourMap destinations={tourData.destinations} />
            </CardContent>
          </Card>
        </Grid>

        {/* Tour Information Section */}
        <Grid item xs={12} md={4}>
          <Box
            elevation={4}
            sx={{
              width: "100%",
              p: 0,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Card variant="outlined">
              <CardContent>
                {/* Tour Title and Admin Actions */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    color="primary"
                    fontWeight="bold"
                  >
                    {tourData.tourName}
                  </Typography>

                  {storedUser && storedUser.role === "ADMIN" && (
                    <Box>
                      <Tooltip title="Chỉnh sửa tour">
                        <IconButton onClick={goToUpdateTour} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa tour">
                        <IconButton
                          onClick={() => setOpenDeleteDialog(true)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {/* Pricing Section with Enhanced Design */}
                <Box mb={3} p={2} bgcolor="grey.100" borderRadius={2}>
                  <Typography
                    variant="h6"
                    align="center"
                    color="primary"
                    gutterBottom
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                  >
                    <AttachMoneyIcon /> Bảng giá
                  </Typography>

                  <Stack spacing={1}>
                    {selectedDeparture?.tourPricing.map((price) => (
                      <Box
                        key={price.participantType}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={1}
                        bgcolor="background.paper"
                        borderRadius={1}
                      >
                        <Typography variant="body1" fontWeight="medium">
                          {participantTypeTranslation[price.participantType] ||
                            price.participantType}
                        </Typography>
                        <Typography
                          color="error"
                          fontWeight="bold"
                          variant="h6"
                        >
                          {formatPrice(price.price)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Tour Details with Enhanced Layout */}
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  mb={3}
                >
                  <Chip
                    icon={<CalendarIcon />}
                    label={`${tourData.duration} ngày`}
                    variant="outlined"
                    color="primary"
                  />
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating
                      value={averageRating}
                      precision={0.5}
                      readOnly
                      icon={<StarIcon color="primary" />}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({tourData.reviews.length} đánh giá)
                    </Typography>
                  </Box>
                </Stack>

                {/* Destinations with Enhanced Layout */}
                <Card
                  variant="outlined"
                  sx={{
                    mb: 3,
                    transition: "all 0.3s ease",
                    "&:hover": { boxShadow: 1 },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="primary"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <LocationOnIcon /> Điểm đến
                    </Typography>
                    <Stack spacing={1}>
                      {tourData.destinations.map((dest, index) => (
                        <Chip
                          key={dest.destinationId}
                          label={`${index + 1}. ${dest.name}, ${dest.province}`}
                          variant="outlined"
                          color="secondary"
                          icon={<LocationOnIcon fontSize="small" />}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Departure Dates Section */}
                <Box mb={3}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    textAlign="center"
                  >
                    Chọn ngày khởi hành
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TourCalendar
                        departures={tourData.departures}
                        onDateSelect={setSelectedDeparture}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DepartureDates
                        departures={tourData.departures}
                        onDateSelect={setSelectedDeparture}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Booking Button with Enhanced Style */}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={goToBooking}
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 3,
                    },
                  }}
                >
                  Đặt tour ngay
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} md={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Tour nổi bật
            </Typography>
            <TopTours />
          </Box>
        </Grid>
      </Grid>

      {/* Detailed Itinerary Section */}
      <Box my={4}>
        <Typography
          variant="h4"
          gutterBottom
          color="primary"
          textAlign="center"
        >
          Chi tiết lịch trình
        </Typography>
        <ItineraryDetail destinations={tourData.destinations} />
      </Box>

      {/* Reviews Section */}
      <ReviewComponent reviews={tourData.reviews} tourId={tourData.tourId} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Fade}
      >
        <DialogTitle
          id="alert-dialog-title"
          color="error"
          sx={{ fontWeight: "bold" }}
        >
          Xác nhận xóa tour
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            color="text.secondary"
          >
            Bạn có chắc chắn muốn xóa tour "{tourData.tourName}" không? Hành
            động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              deleteTourById();
              setOpenDeleteDialog(false);
            }}
            color="error"
            variant="contained"
            autoFocus
          >
            Xóa tour
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TourDetailComponent;
