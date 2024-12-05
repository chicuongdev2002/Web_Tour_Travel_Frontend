import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TablePagination,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
} from "recharts";
import { Calendar, TrendingUp, Star, MessageCircle, Users } from "lucide-react";
import {
  reviewMonthlyStatis,
  statisticsTourReview,
} from "../../functions/statisticsTourReview";
import axios from "axios";

const TourStatisticsDashboard = () => {
  // State Management
  const [data, setData] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("totalReviews");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [userStatsPage, setUserStatsPage] = useState(0);
  const [userStatsRowsPerPage, setUserStatsRowsPerPage] = useState(5);

  // Colors for charts
  const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tourResponse, reviewResponse, userStatsResponse] =
          await Promise.all([
            statisticsTourReview(),
            reviewMonthlyStatis(),
            axios.get("http://localhost:8080/api/reviews/user-statistics"),
          ]);

        setData(tourResponse);
        setTimeSeriesData(reviewResponse);
        setUserStats(userStatsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data Processing
  const filteredData = data
    .filter((tour) =>
      tour.tourName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "totalReviews") return b.totalReviews - a.totalReviews;
      if (sortBy === "averageRating") return b.averageRating - a.averageRating;
      return 0;
    });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const toursWithReviews = filteredData.filter((tour) => tour.totalReviews > 0);

  const totalReviews = data.reduce((sum, tour) => sum + tour.totalReviews, 0);
  const averageRating =
    toursWithReviews.length > 0
      ? (
          toursWithReviews.reduce((sum, tour) => sum + tour.averageRating, 0) /
          toursWithReviews.length
        ).toFixed(2)
      : 0;

  // Rating Distribution Calculation
  const totalRatingDistribution = data.reduce((acc, tour) => {
    tour.ratingDistribution?.forEach((count, index) => {
      acc[index] = (acc[index] || 0) + count;
    });
    return acc;
  }, []);

  const ratingDistributionData = totalRatingDistribution.map(
    (count, index) => ({
      rating: `${index + 1} sao`,
      count: count,
    }),
  );

  // Top Tours Processing
  const topTours = data
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5)
    .map((tour) => ({
      ...tour,
      completionRate: Math.floor(Math.random() * 30) + 70,
    }));

  // User Statistics Processing
  const userChartData = userStats
    .sort((a, b) => b.totalReviews - a.totalReviews)
    .slice(0, 10)
    .map((user) => ({
      name: user.fullName,
      totalReviews: user.totalReviews,
    }));

  const paginatedUserStats = userStats.slice(
    userStatsPage * userStatsRowsPerPage,
    userStatsPage * userStatsRowsPerPage + userStatsRowsPerPage,
  );

  // Render Component
  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            label="Tìm kiếm tour"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sắp xếp theo</InputLabel>
            <Select
              value={sortBy}
              label="Sắp xếp theo"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="totalReviews">Số lượng đánh giá</MenuItem>
              <MenuItem value="averageRating">Điểm trung bình</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Overview Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          {
            icon: MessageCircle,
            label: "Tổng số tour",
            value: data.length,
            color: "#FF6B6B",
          },
          {
            icon: Star,
            label: "Tour có đánh giá",
            value: toursWithReviews.length,
            color: "#4ECDC4",
          },
          {
            icon: Calendar,
            label: "Tổng số đánh giá",
            value: totalReviews,
            color: "#45B7D1",
          },
          {
            icon: TrendingUp,
            label: "Điểm trung bình",
            value: averageRating,
            color: "#96CEB4",
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <stat.icon size={24} color={stat.color} />
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Time Series and Top Tours */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Xu hướng đánh giá theo thời gian
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeSeriesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="reviewsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#45B7D1"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#45B7D1"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="totalReviews"
                      stroke="#45B7D1"
                      fillOpacity={1}
                      fill="url(#reviewsGradient)"
                      name="Số đánh giá"
                    />
                    <Line
                      type="monotone"
                      dataKey="averageRating"
                      stroke="#FF6B6B"
                      name="Điểm trung bình"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Tours
              </Typography>
              <Stack spacing={2}>
                {topTours.map((tour, index) => (
                  <Box key={index}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: "60%" }}
                      >
                        {tour.tourName}
                      </Typography>
                      <Chip
                        size="small"
                        label={`${tour.averageRating} ★`}
                        color="primary"
                        sx={{ bgcolor: COLORS[index % COLORS.length] }}
                      />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={tour.completionRate}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: COLORS[index % COLORS.length],
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bar Chart and Pie Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Số lượng đánh giá theo tour
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={paginatedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="tourName"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="totalReviews"
                      fill="#45B7D1"
                      name="Số lượng đánh giá"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Paper sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 2 }}>
                <TablePagination
                  component="div"
                  count={filteredData.length}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Số tour mỗi trang"
                />
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phân phối đánh giá
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratingDistributionData}
                      dataKey="count"
                      nameKey="rating"
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      label
                    >
                      {ratingDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Statistics Section */}
      {/* <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent> */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Users size={24} color="#FF6B6B" />
        <Typography variant="h6">Thống kê đánh giá theo người dùng</Typography>
      </Stack>

      {/* Bar Chart for User Statistics */}
      <Box sx={{ width: "80%", height: 300, mb: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={userChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="totalReviews"
              fill="#FF6B6B"
              name="Số lượng đánh giá"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      {/* </CardContent>
          </Card>
        </Grid>
      </Grid> */}
      {/* <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Users size={24} color="#FF6B6B" />
                <Typography variant="h6">
                  Thống kê đánh giá theo người dùng
                </Typography>
              </Stack> */}
      {/* User Statistics Table */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Users size={24} color="#FF6B6B" />
        <Typography variant="h6">Thống kê bình luận gần đây</Typography>
      </Stack>
      <TableContainer sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="user statistics table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Tên người dùng</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Số lượng đánh giá
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Đánh giá gần nhất
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Bình luận gần nhất
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Ngày đánh giá
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUserStats.map((user) => {
              const latestReview = user.reviews && user.reviews[0];
              return (
                <TableRow key={user.fullName} hover>
                  <TableCell component="th" scope="row">
                    {user.fullName}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={user.totalReviews}
                      color="primary"
                      size="small"
                      sx={{ bgcolor: "#FF6B6B" }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {latestReview ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        <Star size={16} color="#FFD700" />
                        <Typography>{latestReview.rating}</Typography>
                      </Stack>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ maxWidth: 300 }}>
                      {latestReview?.comment || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {latestReview
                      ? new Date(latestReview.reviewDate).toLocaleDateString(
                          "vi-VN",
                        )
                      : "N/A"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={userStats.length}
        page={userStatsPage}
        onPageChange={(e, newPage) => setUserStatsPage(newPage)}
        rowsPerPage={userStatsRowsPerPage}
        onRowsPerPageChange={(e) => {
          setUserStatsRowsPerPage(parseInt(e.target.value, 10));
          setUserStatsPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Số người dùng mỗi trang"
      />

      {/* </CardContent>
          </Card>
        </Grid>
      </Grid> */}

      {/* Tour Pagination */}
    </Box>
  );
};

export default TourStatisticsDashboard;
