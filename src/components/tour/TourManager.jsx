import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
  Chip,
  Pagination,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import {
  Place,
  AccessTime,
  DateRange,
  Group,
  Search,
  FamilyRestroom as FamilyRestroomIcon,
  Group as GroupIcon,
  Tour as TourIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";
import { getTourManager } from "../../functions/getTourManager";
import { approveTour } from "../../functions/approveTour";
import { useNavigate } from "react-router-dom";
const participantTypeMap = {
  CHILDREN: "Trẻ em",
  ELDERLY: "Người cao tuổi",
  ADULTS: "Người lớn",
};

const tourTypeMap = {
  FAMILY: "Gia đình",
  GROUP: "Nhóm",
  DELETE: "Ngừng hoạt động",
};
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const TourManager = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 6,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [tourTypeFilter, setTourTypeFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState("");
  const handleEditTour = (tour) => {
    navigate(`/update-tour/${tour.tourId}`, { state: tour });
  };
  const fetchTours = async (page) => {
    try {
      const data = await getTourManager(page, pageInfo.pageSize);
      setTours(data.content);
      setFilteredTours(data.content);
      setPageInfo({
        totalPages: data.page.totalPages,
        totalElements: data.page.totalElements,
        currentPage: page,
        pageSize: data.page.size,
      });
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  useEffect(() => {
    fetchTours(0);
  }, []);
  const applyFilters = () => {
    let result = tours;

    if (searchTerm) {
      result = result.filter(
        (tour) =>
          tour.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.startLocation.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (tourTypeFilter) {
      result = result.filter((tour) => tour.tourType === tourTypeFilter);
    }

    if (activeFilter) {
      result = result.filter((tour) =>
        activeFilter === "approved" ? tour.active : !tour.active,
      );
    }

    if (priceRangeFilter) {
      result = result.filter((tour) => {
        const minPrice = tour.departures[0]?.tourPricing[0]?.price || 0;
        switch (priceRangeFilter) {
          case "low":
            return minPrice < 1000000;
          case "medium":
            return minPrice >= 1000000 && minPrice < 3000000;
          case "high":
            return minPrice >= 3000000;
          default:
            return true;
        }
      });
    }

    setFilteredTours(result);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, tourTypeFilter, activeFilter, priceRangeFilter, tours]);

  const handleChangePage = (event, value) => {
    const newPage = value - 1;
    fetchTours(newPage);
  };

  const handleOpenTourDetails = (tour) => {
    setSelectedTour(tour);
  };

  const handleCloseTourDetails = () => {
    setSelectedTour(null);
  };

  const handleApproveTour = async (tourId) => {
    const isApproved = await approveTour(tourId);
    if (isApproved) {
      fetchTours(pageInfo.currentPage);
    } else {
      console.error("Failed to approve tour");
    }
  };

  const renderTourDetailsModal = () => {
    if (!selectedTour) return null;

    return (
      <Dialog
        open={!!selectedTour}
        onClose={handleCloseTourDetails}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#f0f0f0",
            py: 2,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {selectedTour.tourName}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={selectedTour.images[0]}
                  alt={selectedTour.tourName}
                  sx={{
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                {selectedTour.images.length > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                      p: 2,
                    }}
                  >
                    {selectedTour.images.slice(1, 4).map((image, index) => (
                      <CardMedia
                        key={index}
                        component="img"
                        height="80"
                        width="80"
                        image={image}
                        sx={{
                          borderRadius: 1,
                          objectFit: "cover",
                          cursor: "pointer",
                          opacity: 0.7,
                          "&:hover": { opacity: 1 },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  mb: 3,
                  color: "text.secondary",
                  lineHeight: 1.6,
                }}
              >
                {selectedTour.tourDescription}
              </Typography>

              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Place color="primary" />
                        <Typography variant="subtitle2">
                          Điểm khởi hành: {selectedTour.startLocation}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AccessTime color="primary" />
                        <Typography variant="subtitle2">
                          Thời lượng: {selectedTour.duration} ngày
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {selectedTour.departures.map((departure, index) => (
                <Card
                  key={departure.departureId}
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        fontWeight: "bold",
                        color: "primary.main",
                      }}
                    >
                      Đợt khởi hành {index + 1}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <DateRange color="primary" />
                          <Typography variant="body2">
                            {format(
                              new Date(departure.startDate),
                              "dd/MM/yyyy",
                            )}{" "}
                            -{format(new Date(departure.endDate), "dd/MM/yyyy")}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Group color="primary" />
                          <Typography variant="body2">
                            Chỗ trống: {departure.availableSeats} /{" "}
                            {departure.maxParticipants}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <TableContainer sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableBody>
                          {departure.tourPricing.map((pricing) => (
                            <TableRow key={pricing.participantType}>
                              <TableCell>
                                <Typography variant="body2">
                                  {participantTypeMap[pricing.participantType]}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  variant="body2"
                                  color="primary"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  {formatCurrency(pricing.price)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseTourDetails}
            color="primary"
            variant="outlined"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderTourCard = (tour) => {
    const isDeleted = tour.tourType === "DELETE";
    const displayedTourType = tourTypeMap[tour.tourType] || "Không xác định";
    return (
      <Grid item xs={12} sm={6} md={4} key={tour.tourId}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            opacity: isDeleted ? 0.5 : 1,
            textDecoration: isDeleted ? "line-through" : "none",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => handleEditTour(tour)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              backgroundColor: "white",
            }}
          >
            <EditIcon />
          </IconButton>
          <CardMedia
            component="img"
            height="200"
            image={tour.images[0]}
            alt={tour.tourName}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" gutterBottom>
              {tour.tourName}
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 1 }}
            >
              <Chip
                label={displayedTourType}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontWeight: "medium",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <BusinessIcon fontSize="small" color="action" />
                  ĐẠI LÝ CUNG CẤP: {tour.fullName}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Chip
                label={
                  isDeleted
                    ? tourTypeMap[tour.tourType]
                    : tour.active
                      ? "Đã phê duyệt"
                      : "Chưa phê duyệt"
                }
                color={isDeleted ? "error" : tour.active ? "success" : "error"}
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleOpenTourDetails(tour)}
              >
                Chi tiết
              </Button>
              {!tour.active && !isDeleted && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleApproveTour(tour.tourId)}
                >
                  Phê Duyệt
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const renderFilterSection = () => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TextField
        label="Tìm kiếm Tour"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ maxWidth: 300 }}
        InputProps={{
          startAdornment: <Search />,
        }}
      />

      <FormControl variant="outlined" sx={{ minWidth: 200 }}>
        <InputLabel>Loại Tour</InputLabel>
        <Select
          value={tourTypeFilter}
          onChange={(e) => setTourTypeFilter(e.target.value)}
          label="Loại Tour"
        >
          <MenuItem value="">Tất cả</MenuItem>
          {Object.entries(tourTypeMap).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" sx={{ minWidth: 200 }}>
        <InputLabel>Trạng Thái</InputLabel>
        <Select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          label="Trạng Thái"
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="approved">Đã phê duyệt</MenuItem>
          <MenuItem value="unapproved">Chưa phê duyệt</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" sx={{ minWidth: 200 }}>
        <InputLabel>Mức Giá</InputLabel>
        <Select
          value={priceRangeFilter}
          onChange={(e) => setPriceRangeFilter(e.target.value)}
          label="Mức Giá"
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="low">Dưới 1 triệu</MenuItem>
          <MenuItem value="medium">1 - 3 triệu</MenuItem>
          <MenuItem value="high">Trên 3 triệu</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          textAlign: "center",
          mb: 4,
          fontWeight: "bold",
        }}
      >
        Danh mục Tour
      </Typography>

      {renderFilterSection()}

      {filteredTours.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy tour phù hợp
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredTours.map(renderTourCard)}
        </Grid>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={pageInfo.totalPages}
          page={pageInfo.currentPage + 1}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>

      {renderTourDetailsModal()}
    </Container>
  );
};

export default TourManager;
