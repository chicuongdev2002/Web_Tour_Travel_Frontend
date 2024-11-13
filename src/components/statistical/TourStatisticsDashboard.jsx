import React, { useEffect, useState } from 'react';
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
  IconButton,
  Tooltip as MuiTooltip
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Calendar, TrendingUp, Star, MessageCircle } from 'lucide-react';

const TourStatisticsDashboard = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState('totalReviews');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);

  // Thêm mock data cho biểu đồ theo thời gian
  const generateTimeSeriesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      reviews: Math.floor(Math.random() * 50) + 10,
      rating: (Math.random() * 2 + 3).toFixed(1)
    }));
  };

  const timeSeriesData = generateTimeSeriesData();

  // Mock data cho top tours
  const topTours = data
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5)
    .map(tour => ({
      ...tour,
      completionRate: Math.floor(Math.random() * 30) + 70 // Mock completion rate 70-100%
    }));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/reviews/statistics-tour-review');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching tour statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Existing filter and sort logic...
  const filteredData = data
    .filter(tour => tour.tourName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'totalReviews') return b.totalReviews - a.totalReviews;
      if (sortBy === 'averageRating') return b.averageRating - a.averageRating;
      return 0;
    });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const toursWithReviews = filteredData.filter(tour => tour.totalReviews > 0);

  // Calculate statistics
  const totalReviews = data.reduce((sum, tour) => sum + tour.totalReviews, 0);
  const averageRating = toursWithReviews.length > 0
    ? (toursWithReviews.reduce((sum, tour) => sum + tour.averageRating, 0) / toursWithReviews.length).toFixed(2)
    : 0;

  // Rating distribution data
  const totalRatingDistribution = data.reduce((acc, tour) => {
    tour.ratingDistribution?.forEach((count, index) => {
      acc[index] = (acc[index] || 0) + count;
    });
    return acc;
  }, []);

  const ratingDistributionData = totalRatingDistribution.map((count, index) => ({
    rating: `${index + 1} sao`,
    count: count
  }));

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
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
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Thời gian</InputLabel>
            <Select
              value={timeRange}
              label="Thời gian"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="all">Tất cả thời gian</MenuItem>
              <MenuItem value="month">Tháng này</MenuItem>
              <MenuItem value="quarter">Quý này</MenuItem>
              <MenuItem value="year">Năm nay</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Overview Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { icon: MessageCircle, label: 'Tổng số tour', value: data.length, color: '#FF6B6B' },
          { icon: Star, label: 'Tour có đánh giá', value: toursWithReviews.length, color: '#4ECDC4' },
          { icon: Calendar, label: 'Tổng số đánh giá', value: totalReviews, color: '#45B7D1' },
          { icon: TrendingUp, label: 'Điểm trung bình', value: averageRating, color: '#96CEB4' }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              borderRadius: 2, 
              boxShadow: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
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

      {/* New Section: Time Series Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Xu hướng đánh giá theo thời gian
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <AreaChart
                  width={800}
                  height={350}
                  data={timeSeriesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="reviewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#45B7D1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#45B7D1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="reviews"
                    stroke="#45B7D1"
                    fillOpacity={1}
                    fill="url(#reviewsGradient)"
                    name="Số đánh giá"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rating"
                    stroke="#FF6B6B"
                    name="Điểm trung bình"
                  />
                </AreaChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Tours Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Tours
              </Typography>
              <Stack spacing={2}>
                {topTours.map((tour, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: '60%' }}>
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
                        bgcolor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: COLORS[index % COLORS.length],
                          borderRadius: 3,
                        }
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Existing Charts with Updated Styling */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Số lượng đánh giá theo tour
              </Typography>
              <Box sx={{ width: '100%', height: 400, overflowX: 'auto' }}>
                <BarChart
                  width={Math.max(paginatedData.length * 100, 500)}
                  height={350}
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
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phân phối đánh giá
              </Typography>
              <Box sx={{ width: '100%', height: 400, display: 'flex', justifyContent: 'center' }}>
                <PieChart width={400} height={350}>
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pagination with Updated Styling */}
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
    </Box>
  );
};

export default TourStatisticsDashboard;