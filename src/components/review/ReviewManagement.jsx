import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Alert,
  AlertTitle,
  Chip,
  IconButton,
  Tooltip,
  Container,
  Card,
  TextField,
  MenuItem,
  InputBase,
  Button,
  Select, FormControl, InputLabel,useTheme,
  styled,
  alpha,
} from "@mui/material";
import {
  Star as StarIcon,
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { changeActive, getReview } from "../../functions/getReview";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: "8px 12px",
    fontSize: "0.8rem",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
    "& fieldset": {
      borderColor: alpha(theme.palette.primary.main, 0.2),
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));
const ReviewManagement = () => {
  const theme = useTheme();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5);
  const [selectedReview, setSelectedReview] = useState(null);
  const [inputKeyword, setInputKeyword] = useState(""); 
  const [searchKeyword, setSearchKeyword] = useState(""); 
  const [rating, setRating] = useState(null);
  const [active, setActive] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
    const formatDateForAPI = (date) => {
    if (!date) return null;
    const dateObj = date instanceof Date ? date : new Date(date);
    return isNaN(dateObj.getTime()) ? null : dateObj.toISOString();
  };
  const fetchReviews = async (currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate =formatDateForAPI(endDate);
      const response = await getReview(currentPage - 1, pageSize, searchKeyword, rating, formattedStartDate, formattedEndDate, active);
      setReviews(response.data.content);
      setTotalPages(response.data.page.totalPages);
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
      setError("Không thể tải danh sách đánh giá. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (reviewId, currentStatus) => {
    try {
      const response = await changeActive(reviewId, currentStatus);
      if (response) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.reviewId === reviewId
              ? { ...review, active: !currentStatus }
              : review,
          ),
        );
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái đánh giá:", error);
      setError("Không thể cập nhật trạng thái đánh giá.");
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = () => {
    setSearchKeyword(inputKeyword);
    setPage(1);
  };

  useEffect(() => {
      if ((startDate && endDate) || (!startDate && !endDate)) {
    fetchReviews(page);
  }
  }, [page, searchKeyword, rating, active, startDate, endDate]);

  const renderRating = (rating) => {
    return (
      <Box display="flex" alignItems="center">
        {[...Array(5)].map((star, index) => (
          <StarIcon
            key={index}
            color={index < rating ? "primary" : "disabled"}
            fontSize="small"
          />
        ))}
        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
          ({rating}/5)
        </Typography>
      </Box>
    );
  };

  const handleOpenReviewDetails = (review) => {
    setSelectedReview(review);
  };

  const handleCloseReviewDetails = () => {
    setSelectedReview(null);
  };
const handleClearFilters = () => {
  setInputKeyword(""); 
  setSearchKeyword(""); 
  setRating(null); 
  setActive(null); 
   setStartDate(null); 
    setEndDate(null);
  setPage(1); 
};
  if (loading) {
    return (
      <Container
        maxWidth={false}
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Đang tải danh sách đánh giá...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false}>
        <Alert severity="error" sx={{ m: 2 }}>
          <AlertTitle>Lỗi</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
     <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        py: 2,
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h4" fontWeight="bold">
          Quản Lý Đánh Giá
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm theo tên người dùng..."
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            size="small"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Tìm Kiếm
          </Button>
          <Button 
    variant="outlined" 
    color="secondary" 
    onClick={handleClearFilters}
  >
    Xóa Bộ Lọc
  </Button>
          <FormControl variant="outlined" size="small">
  <InputLabel>Xếp hạng (1-5)</InputLabel>
  <Select
    value={rating || ""}
    onChange={(e) => setRating(e.target.value ? Number(e.target.value) : null)}
    label="Xếp hạng (1-5)"
    displayEmpty
  >
    <MenuItem value=""><em>Chọn xếp hạng</em></MenuItem>
    {[1, 2, 3, 4, 5].map((num) => (
      <MenuItem key={num} value={num}>{num}</MenuItem>
    ))}
  </Select>
</FormControl>
          <TextField
            variant="outlined"
            select
            label="Trạng thái"
            value={active || ""}
            onChange={(e) => setActive(e.target.value ? (e.target.value === "true") : null)}
            size="small"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="true">Hoạt Động</MenuItem>
            <MenuItem value="false">Ngừng Hoạt Động</MenuItem>
          </TextField>
           <Box display="flex" gap={2} alignItems="center">
               <StyledDatePicker
    label="Từ ngày"
    value={startDate}
    onChange={(newValue) => setStartDate(newValue)}
    slotProps={{
      textField: {
        variant: "outlined",
        fullWidth: true,
        size: "small",
        format: "dd/MM/yyyy"
      },
    }}
  />
  <StyledDatePicker
    label="Đến ngày"
    value={endDate}
    onChange={(newValue) => setEndDate(newValue)}
    slotProps={{
      textField: {
        variant: "outlined",
        fullWidth: true,
        size: "small",
        format: "dd/MM/yyyy"
      },
    }}
  />
  </Box>
        </Box>
      </Box>

      <TableContainer sx={{ flex: 1, overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Mã</TableCell>
              <TableCell sx={{ color: "white" }}>Người Dùng</TableCell>
              <TableCell sx={{ color: "white" }}>Tour</TableCell>
              <TableCell sx={{ color: "white" }}>Xếp Hạng</TableCell>
              <TableCell sx={{ color: "white" }}>Nhận Xét</TableCell>
              <TableCell sx={{ color: "white" }} align="center">
                Ngày Đánh Giá
              </TableCell>
              <TableCell sx={{ color: "white" }} align="center">
                Trạng Thái
              </TableCell>
              <TableCell sx={{ color: "white" }} align="center">
                Thao Tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow
                key={review.reviewId}
                hover
                onClick={() => handleOpenReviewDetails(review)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{review.reviewId}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {review.user.fullName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={review.tour.tourName}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{renderRating(review.rating)}</TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {new Date(review.reviewDate).toLocaleDateString("vi-VN")}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={review.active ? "Hoạt Động" : "Ngừng Hoạt Động"}
                    color={review.active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={review.active ? "Tạm Ngừng" : "Kích Hoạt"}>
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleActive(review.reviewId, review.active);
                      }}
                      color={review.active ? "warning" : "primary"}
                    >
                      {review.active ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            variant="outlined"
            shape="rounded"
          />
        </Box>
      )}

      {/* Dialog chi tiết đánh giá */}
      {selectedReview && (
        <Dialog
          open={!!selectedReview}
          onClose={handleCloseReviewDetails}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Chi Tiết Đánh Giá
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" flexDirection="column" gap={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Người Dùng: {selectedReview.user.fullName}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Mail: {selectedReview.user.email}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Số điện thoại: {selectedReview.user.phoneNumber}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Ngày:{" "}
                  {new Date(selectedReview.reviewDate).toLocaleString("vi-VN")}
                </Typography>
              </Box>
              <Typography variant="subtitle1">
                Tour: {selectedReview.tour.tourName}
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Địa điểm bắt đầu: {selectedReview.tour.startLocation}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Loại tour:{" "}
                  {selectedReview.tour.tourType === "FAMILY"
                    ? "Gia đình"
                    : "Nhóm"}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Thời gian: {selectedReview.tour.duration}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="subtitle1">Xếp Hạng:</Typography>
                {renderRating(selectedReview.rating)}
              </Box>
              <Typography variant="body1">
                <strong>Nhận Xét:</strong> {selectedReview.comment}
              </Typography>
              <Chip
                label={selectedReview.active ? "Hoạt Động" : "Ngừng Hoạt Động"}
                color={selectedReview.active ? "success" : "default"}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReviewDetails} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
    </LocalizationProvider>
  );
};

export default ReviewManagement;