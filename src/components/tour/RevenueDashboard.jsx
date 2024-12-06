import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Stack,
  useTheme,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import {
  Print,
  FileDownload,
  Settings,
  Close as CloseIcon,
  FileDownload as ExcelIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  fetchTotalRevenue,
  fetchTourRevenue,
  fetchMonthlyRevenue,
} from "../../functions/statisRevenue";

const RevenueDashboard = () => {
  const theme = useTheme();
  const dashboardRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return new Date(today.setDate(today.getDate() + 7));
  });

  const [totalRevenueData, setTotalRevenueData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [tourRevenueData, setTourRevenueData] = useState({
    tours: [],
    ticketRevenue: {},
  });

  // New states for export features
  const [isExporting, setIsExporting] = useState(false);
  const [exportSettingsOpen, setExportSettingsOpen] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState({
    dailyRevenue: true,
    monthlyGrowth: true,
    tourRevenue: true,
    ticketRevenue: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const formatRevenue = (value) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  // Tooltips
  const DailyRevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-white p-2 shadow-md border border-gray-200">
          <Typography className="text-gray-600 text-sm">
            {`Ngày: ${format(new Date(label), "dd/MM/yyyy")}`}
          </Typography>
          <Typography className="text-primary font-medium text-sm">
            {`Doanh thu: ${formatRevenue(payload[0].value)} VND`}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  const MonthlyGrowthTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-white p-2 shadow-md border border-gray-200">
          <Typography className="text-gray-600 text-sm">
            {`Tháng ${label}`}
          </Typography>
          <Typography className="text-primary font-medium text-sm">
            {`Doanh thu: ${formatRevenue(payload[0].value)} VND`}
          </Typography>
          <Typography className="text-green-600 font-medium text-sm">
            {`Tăng trưởng: ${payload[1].value.toFixed(1)}%`}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  const TourRevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-white p-2 shadow-md border border-gray-200">
          <Typography className="text-gray-600 text-sm whitespace-normal max-w-xs">
            {`Tour: ${label}`}
          </Typography>
          <Typography className="text-primary font-medium text-sm">
            {`Doanh thu: ${formatRevenue(payload[0].value)} VND`}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  const TicketRevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = ticketRevenueData.reduce(
        (sum, item) => sum + item.value,
        0,
      );
      const percentage = ((payload[0].value / total) * 100).toFixed(1);

      return (
        <Card className="bg-white p-2 shadow-md border border-gray-200">
          <Typography className="text-gray-600 text-sm">
            {`Loại vé: ${payload[0].name}`}
          </Typography>
          <Typography className="text-primary font-medium text-sm">
            {`Doanh thu: ${formatRevenue(payload[0].value)} VND`}
          </Typography>
          <Typography className="text-blue-600 font-medium text-sm">
            {`Tỷ lệ: ${percentage}%`}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  // Data fetching
  const fetchRevenueData = async () => {
    try {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      const yearFromEndDate = new Date(endDate).getFullYear();

      const totalRevenueResult = await fetchTotalRevenue(
        formattedStartDate,
        formattedEndDate,
      );
      setTotalRevenueData(totalRevenueResult);

      const tourRevenueResult = await fetchTourRevenue(
        formattedStartDate,
        formattedEndDate,
      );
      setTourRevenueData(tourRevenueResult);

      const monthlyRevenueResult = await fetchMonthlyRevenue(yearFromEndDate);
      const fullYearData = Array.from({ length: 12 }, (_, i) => {
        const monthNumber = i + 1;
        const monthData = monthlyRevenueResult.find(
          (m) => parseInt(m.month) === monthNumber,
        );
        return (
          monthData || {
            month: monthNumber.toString(),
            revenue: 0,
            growthRate: 0,
          }
        );
      });

      setMonthlyRevenueData(fullYearData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu doanh thu:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi tải dữ liệu",
        severity: "error",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };
  const handleExportExcel = () => {
    try {
      // Tạo workbook mới
      const wb = XLSX.utils.book_new();

      // Sheet 1: Doanh thu theo ngày
      const dailyRevenueSheet = totalRevenueData.map((item) => ({
        Ngày: format(new Date(item.date), "dd/MM/yyyy"),
        "Doanh Thu (VND)": item.totalRevenue,
      }));
      const ws1 = XLSX.utils.json_to_sheet(dailyRevenueSheet);
      XLSX.utils.book_append_sheet(wb, ws1, "Doanh Thu Theo Ngày");

      // Sheet 2: Tăng trưởng theo tháng
      const monthlyGrowthSheet = monthlyRevenueData.map((item) => ({
        Tháng: item.month,
        "Doanh Thu (VND)": item.revenue,
        "Tăng Trưởng (%)": item.growthRate,
      }));
      const ws2 = XLSX.utils.json_to_sheet(monthlyGrowthSheet);
      XLSX.utils.book_append_sheet(wb, ws2, "Tăng Trưởng Theo Tháng");

      // Sheet 3: Doanh thu theo tour
      const tourRevenueSheet = tourRevenueData.tours.map((item) => ({
        "Tên Tour": item.tourName,
        "Doanh Thu (VND)": item.revenue,
      }));
      const ws3 = XLSX.utils.json_to_sheet(tourRevenueSheet);
      XLSX.utils.book_append_sheet(wb, ws3, "Doanh Thu Theo Tour");

      // Sheet 4: Doanh thu theo loại vé
      const ticketRevenueSheet = ticketRevenueData.map((item) => ({
        "Loại Vé": item.name,
        "Doanh Thu (VND)": item.value,
      }));
      const ws4 = XLSX.utils.json_to_sheet(ticketRevenueSheet);
      XLSX.utils.book_append_sheet(wb, ws4, "Doanh Thu Theo Loại Vé");

      // Thêm styling cho các sheet
      [ws1, ws2, ws3, ws4].forEach((ws) => {
        // Định dạng tiêu đề
        const range = XLSX.utils.decode_range(ws["!ref"]);
        const headerStyle = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center" },
        };

        // Áp dụng style cho hàng đầu tiên
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ r: 0, c: C });
          if (!ws[address]) continue;
          ws[address].s = headerStyle;
        }

        // Điều chỉnh độ rộng cột
        const cols = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          cols.push({ wch: 25 }); // độ rộng 25 ký tự
        }
        ws["!cols"] = cols;

        // Thêm màu nền cho các hàng dữ liệu
        for (let R = 1; R <= range.e.r; ++R) {
          const rowStyle = {
            fill: { fgColor: { rgb: R % 2 === 0 ? "EAEAEA" : "FFFFFF" } }, // Màu nền xen kẽ
          };
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[address]) continue;
            ws[address].s = rowStyle;
          }
        }
      });

      // Xuất file
      const fileName = `bao-cao-doanh-thu-${format(new Date(), "dd-MM-yyyy")}.xlsx`;
      XLSX.writeFile(wb, fileName);

      setSnackbar({
        open: true,
        message: "Xuất file Excel thành công",
        severity: "success",
      });
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi xuất Excel",
        severity: "error",
      });
    }
  };

  const handleQuickFilter = (type) => {
    const now = new Date();
    switch (type) {
      case "week":
        setStartDate(startOfWeek(now));
        setEndDate(endOfWeek(now));
        break;
      case "month":
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
        break;
      case "year":
        setStartDate(startOfYear(now));
        setEndDate(endOfYear(now));
        break;
    }
  };

  // Effects
  useEffect(() => {
    fetchRevenueData();
  }, [startDate, endDate]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #dashboard-container, #dashboard-container * {
          visibility: visible;
        }
        #dashboard-container {
          position: absolute;
          left: 0;
          top: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ];

  const ticketRevenueData = Object.entries(
    tourRevenueData.ticketRevenue || {},
  ).map(([name, value]) => ({
    name:
      name === "ADULTS"
        ? "Người lớn"
        : name === "ELDERLY"
          ? "Người cao tuổi"
          : "Trẻ em",
    value,
  }));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container
        maxWidth="lg"
        sx={{ mt: 4, pb: 4 }}
        id="dashboard-container"
        ref={dashboardRef}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Bảng Thống Kê Doanh Thu
          </Typography>

          <Stack direction="row" spacing={2} className="no-print">
            <Button
              variant="contained"
              startIcon={<ExcelIcon />}
              onClick={handleExportExcel}
              sx={{ borderRadius: 2 }}
            >
              Xuất Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
              sx={{ borderRadius: 2 }}
            >
              In báo cáo
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
            alignItems: "center",
          }}
          className="no-print"
        >
          <DatePicker
            label="Từ"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
            sx={{ minWidth: 200 }}
          />
          <DatePicker
            label="Đến"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
            sx={{ minWidth: 200 }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => handleQuickFilter("week")}
              sx={{ borderRadius: 2 }}
            >
              Tuần này
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleQuickFilter("month")}
              sx={{ borderRadius: 2 }}
            >
              Tháng này
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleQuickFilter("year")}
              sx={{ borderRadius: 2 }}
            >
              Năm nay
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Tổng Doanh Thu Theo Ngày */}
          {selectedCharts.dailyRevenue && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", boxShadow: theme.shadows[3] }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "medium" }}
                  >
                    Tổng Doanh Thu Theo Ngày
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={totalRevenueData}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={theme.palette.primary.main}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={theme.palette.primary.main}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                      />
                      <XAxis
                        dataKey="date"
                        stroke={theme.palette.text.secondary}
                        tick={{ fill: theme.palette.text.secondary }}
                      />
                      <YAxis
                        stroke={theme.palette.text.secondary}
                        tick={{ fill: theme.palette.text.secondary }}
                        tickFormatter={formatRevenue}
                      />
                      <Tooltip content={<DailyRevenueTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="totalRevenue"
                        stroke={theme.palette.primary.main}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Tăng Trưởng Doanh Thu Theo Tháng */}
          {selectedCharts.monthlyGrowth && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", boxShadow: theme.shadows[3] }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "medium" }}
                  >
                    Tăng Trưởng Doanh Thu Theo Tháng
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                      />
                      <XAxis
                        dataKey="month"
                        stroke={theme.palette.text.secondary}
                        tick={{ fill: theme.palette.text.secondary }}
                      />
                      <YAxis
                        yAxisId="revenue"
                        stroke={theme.palette.primary.main}
                        tick={{ fill: theme.palette.text.secondary }}
                        tickFormatter={formatRevenue}
                      />
                      <YAxis
                        yAxisId="growth"
                        orientation="right"
                        stroke={theme.palette.success.main}
                        tick={{ fill: theme.palette.text.secondary }}
                      />
                      <Tooltip content={<MonthlyGrowthTooltip />} />
                      <Legend />
                      <Line
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="revenue"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        dot={{
                          fill: theme.palette.primary.main,
                          strokeWidth: 2,
                        }}
                        name="Doanh thu"
                      />
                      <Line
                        yAxisId="growth"
                        type="monotone"
                        dataKey="growthRate"
                        stroke={theme.palette.success.main}
                        strokeWidth={2}
                        dot={{
                          fill: theme.palette.success.main,
                          strokeWidth: 2,
                        }}
                        name="Tăng trưởng"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Doanh Thu Theo Tour */}
          {selectedCharts.tourRevenue && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", boxShadow: theme.shadows[3] }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "medium" }}
                  >
                    Doanh Thu Theo Tour
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tourRevenueData.tours}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                      />
                      <XAxis
                        dataKey="tourName"
                        stroke={theme.palette.text.secondary}
                        tick={{ fill: theme.palette.text.secondary }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis
                        stroke={theme.palette.text.secondary}
                        tick={{ fill: theme.palette.text.secondary }}
                        tickFormatter={formatRevenue}
                      />
                      <Tooltip content={<TourRevenueTooltip />} />
                      <Bar
                        dataKey="revenue"
                        fill={theme.palette.primary.main}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Doanh Thu Theo Loại Vé */}
          {selectedCharts.ticketRevenue && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", boxShadow: theme.shadows[3] }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "medium" }}
                  >
                    Doanh Thu Theo Loại Vé
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ticketRevenueData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {ticketRevenueData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<TicketRevenueTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default RevenueDashboard;
