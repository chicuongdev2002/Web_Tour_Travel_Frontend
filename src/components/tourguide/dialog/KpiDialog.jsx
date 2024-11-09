import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  Rating,
  Badge,
  Chip,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TimerOffIcon from "@mui/icons-material/TimerOff";
// import { handleExport } from '../action/handleExport';
import ExportButton from "../button/ExportButton";
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography color="primary" variant="body2">
          Số lượng: {payload[0].value}
        </Typography>
      </Paper>
    );
  }
  return null;
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const KpiDialog = ({ open, onClose, kpiData }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!kpiData) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogContent>
          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress />
            <Typography sx={{ mt: 2 }} align="center">
              Đang tải dữ liệu KPI...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const ratesData = [
    { name: "Chấp nhận", value: kpiData.acceptRate },
    { name: "Từ chối", value: kpiData.rejectRate },
    { name: "Chờ làm", value: 100 - (kpiData.acceptRate + kpiData.rejectRate) },
  ];

  const COLORS = [
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
  ];

  const toursData = [
    { name: "Tổng tours", value: kpiData.totalAssignedTours },
    { name: "Hoàn thành", value: kpiData.completedTours },
    { name: "Chờ làm", value: kpiData.todoTours },
    { name: "Đã nhận", value: kpiData.acceptTours },
    { name: "Từ chối", value: kpiData.rejectTours },
  ].map((item) => ({
    ...item,
    percent: ((item.value / kpiData.totalAssignedTours) * 100).toFixed(1),
  }));

  const statsCards = [
    {
      icon: <StarIcon color="warning" fontSize="large" />,
      title: "Đánh giá trung bình",
      value: `${kpiData.averageRating.toFixed(2)}/5`,
      component: (
        <Rating
          value={kpiData.averageRating}
          readOnly
          precision={0.1}
          size="small"
        />
      ),
    },
    {
      icon: <EmojiEventsIcon color="primary" fontSize="large" />,
      title: "Tỷ lệ hài lòng",
      value: `${kpiData.satisfactionRate.toFixed(2)}%`,
      progress: kpiData.satisfactionRate,
    },
    {
      icon: <GroupIcon color="secondary" fontSize="large" />,
      title: "Khách hàng độc nhất",
      value: kpiData.uniqueCustomers,
      chip: "Tháng này",
    },
    {
      icon: <AccessTimeIcon color="info" fontSize="large" />,
      title: "Thời gian trung bình",
      value: `${kpiData.averageDuration} giờ`,
      trend: "+5%",
    },
    {
      icon: <TimerOffIcon color="success" fontSize="large" />,
      title: "Tổng thời gian",
      value: `${kpiData.totalDuration} giờ`,
      trend: "+5%",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "80vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 56,
              height: 56,
            }}
          >
            {kpiData.fullName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="div">
              KPI của {kpiData.fullName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              <CalendarTodayIcon sx={{ fontSize: "small", mr: 1 }} />
              {new Date().toLocaleDateString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Tooltip title="In báo cáo">
            <IconButton onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Tải xuống báo cáo">
  <IconButton onClick={() => handleExport(kpiData)}>
    <DownloadIcon />
  </IconButton>
</Tooltip> */}
          <ExportButton kpiData={kpiData} />
          <Tooltip title="Đóng">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            {statsCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      transition: "transform 0.3s",
                    },
                  }}
                >
                  <Box sx={{ mb: 1 }}>{card.icon}</Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {card.value}
                  </Typography>
                  {card.component && <Box sx={{ mt: 1 }}>{card.component}</Box>}
                  {card.progress && (
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={card.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}
                  {card.chip && (
                    <Chip
                      label={card.chip}
                      size="small"
                      sx={{ mt: 1 }}
                      color="primary"
                    />
                  )}
                  {card.trend && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        alignItems: "center",
                        color: theme.palette.success.main,
                      }}
                    >
                      <TrendingUpIcon fontSize="small" />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {card.trend}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  minHeight: 64,
                  fontSize: "1rem",
                },
              }}
            >
              <Tab
                icon={
                  <Badge badgeContent={toursData.length} color="primary">
                    <CalendarTodayIcon />
                  </Badge>
                }
                label="Thống kê Tours"
              />
              <Tab
                icon={
                  <Badge badgeContent={ratesData.length} color="secondary">
                    <PieChart width={24} height={24} />
                  </Badge>
                }
                label="Tỷ lệ"
              />
              <Tab
                icon={
                  <Badge
                    badgeContent={kpiData.customerFeedback.length}
                    color="error"
                  >
                    <ThumbUpIcon />
                  </Badge>
                }
                label="Phản hồi"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={toursData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Legend />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                    label={{
                      position: "top",
                      content: ({ value }) => `${value}`,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={ratesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ratesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <List>
              {kpiData.customerFeedback.map(([feedback, date], index) => (
                <React.Fragment key={date}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" component="div">
                          {feedback}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="textSecondary">
                          {new Date(date).toLocaleString("vi-VN")}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < kpiData.customerFeedback.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          size="large"
          startIcon={<CloseIcon />}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KpiDialog;
