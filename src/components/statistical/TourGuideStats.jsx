import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const TourGuideStats = () => {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [workingHours, setWorkingHours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffect(() => {
    fetchData();
  }, [timeRange]);
  const calculateAverageHours = (workingHours) => {
    if (!workingHours || workingHours.length === 0) return 0;
    const totalHours = workingHours.reduce(
      (sum, guide) => sum + guide.totalHours,
      0,
    );
    return totalHours / workingHours.length;
  };
  const calculateDateRange = (range) => {
    const today = new Date();
    let startDate;
    let endDate;

    switch (range) {
      case "week":
        startDate = new Date(today.setDate(today.getDate() - today.getDay()));
        endDate = new Date(today.setDate(today.getDate() + 6));
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "year":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        startDate = endDate = today;
    }

    return { startDate, endDate };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = calculateDateRange(timeRange);
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();

      const [statsResponse, hoursResponse] = await Promise.all([
        fetch("http://localhost:8080/api/tour-guides/statistics"),
        fetch(
          `http://localhost:8080/api/tour-guides/working-hours?startDate=${startISO}&endDate=${endISO}`,
        ),
      ]);

      const statsResult = await statsResponse.json();
      const hoursResult = await hoursResponse.json();

      setData(statsResult);
      setWorkingHours(hoursResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (event, newValue) => {
    if (newValue !== null) {
      setTimeRange(newValue);
      fetchData();
    }
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const averageHours = calculateAverageHours(workingHours);
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton
          variant="text"
          sx={{ fontSize: "2rem", mb: 3, width: "40%" }}
        />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} md={6} key={i}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading data: {error}
        </Alert>
      </Box>
    );
  }

  if (!data || !workingHours) return null;
  const calculateMaxY = (data) => {
    if (!data) return 0;
    // Tính tổng thực tế từ 3 cột
    const actualTotal =
      (data.totalAccepted || 0) +
      (data.totalRejected || 0) +
      (data.totalTodo || 0);
    return actualTotal;
  };
  const statusData = [
    {
      name: "Chờ chấp nhận",
      value: data.todoRate || 0,
      color: theme.palette.warning.main,
    },
    {
      name: "Đồng ý",
      value: data.acceptanceRate || 0,
      color: theme.palette.success.main,
    },
    {
      name: "Từ chối",
      value: data.rejectionRate || 0,
      color: theme.palette.error.main,
    },
  ].filter((item) => item.value > 0);

  const completionData = [
    {
      name: "Hoàn thành",
      value: data.completionRate || 0,
      color: theme.palette.primary.main,
    },
    {
      name: "Còn lại",
      value: 100 - (data.completionRate || 0),
      color: theme.palette.grey[200],
    },
  ];

  const barData = [
    { name: "Đồng ý", assignments: data?.totalAccepted || 0 },
    { name: "Từ chối", assignments: data?.totalRejected || 0 },
    { name: "Chờ chấp nhận", assignments: data?.totalTodo || 0 },
  ].filter((item) => item.assignments > 0);

  const sortedWorkingHours = [...workingHours].sort(
    (a, b) => b.totalHours - a.totalHours,
  );

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle2" color="textPrimary">
          {payload[0].name}
        </Typography>
        <Typography variant="h6" color="primary">
          {payload[0].dataKey === "totalHours"
            ? `${payload[0].value} giờ`
            : `${payload[0].value.toFixed(1)}%`}
        </Typography>
      </Paper>
    );
  };

  const cardStyle = {
    height: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows[8],
    },
  };

  const CardActions = () => (
    <>
      <IconButton size="small" onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
          Xuất báo cáo
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            fetchData();
          }}
        >
          <RefreshIcon sx={{ mr: 1 }} fontSize="small" />
          Làm mới
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}
        >
          Thống kê phân công hướng dẫn viên
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader
              avatar={<PieChartIcon color="primary" />}
              action={<CardActions />}
              title="Tỷ lệ phân công công việc"
              titleTypographyProps={{ variant: "h6" }}
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 340 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => (
                        <Typography variant="body2" component="span">
                          {`${value} (${entry.payload.value.toFixed(1)}%)`}
                        </Typography>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader
              avatar={<TimelineIcon color="primary" />}
              action={<CardActions />}
              title="Tổng quan phân công công việc"
              titleTypographyProps={{ variant: "h6" }}
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 340 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.palette.divider}
                    />
                    <XAxis dataKey="name" />
                    <YAxis
                      domain={[0, calculateMaxY(data)]}
                      tickCount={6}
                      allowDecimals={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="assignments"
                      fill={theme.palette.primary.main}
                      radius={[1, 1, 0, 0]}
                      maxBarSize={60}
                      name="Số lượng"
                    />
                    <Label
                      value={`Giá trị trung bình: ${averageHours.toFixed(1)} giờ`}
                      position="top"
                      fontSize="14"
                      fill={theme.palette.text.primary}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader
              avatar={<CheckCircleIcon color="primary" />}
              action={<CardActions />}
              title="Tỉ lệ hoàn thành công việc"
              titleTypographyProps={{ variant: "h6" }}
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 340 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => (
                        <Typography variant="body2" component="span">
                          {`${value} (${entry.payload.value.toFixed(1)}%)`}
                        </Typography>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader
              avatar={<AccessTimeIcon color="primary" />}
              action={<CardActions />}
              title="Số giờ làm việc của hướng dẫn viên"
              titleTypographyProps={{ variant: "h6" }}
            />
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              size="small"
            >
              <ToggleButton value="week">Tuần này</ToggleButton>
              <ToggleButton value="month">Tháng này</ToggleButton>
              <ToggleButton value="year">Năm nay</ToggleButton>
            </ToggleButtonGroup>
            <Divider />
            <CardContent>
              <Box sx={{ height: 340 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={sortedWorkingHours}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.palette.divider}
                    />
                    <XAxis
                      type="number"
                      domain={[0, 50]}
                      ticks={[0, 10, 20, 30, 40, 50]}
                    />
                    <YAxis
                      dataKey="guideName"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={110}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="totalHours"
                      fill={theme.palette.secondary.main}
                      radius={[0, 4, 4, 0]}
                      maxBarSize={30}
                      name="Số giờ làm việc"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TourGuideStats;
