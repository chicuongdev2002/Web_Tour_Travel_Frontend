import React, { useState, useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Map as MapIcon,
  CalendarMonth as CalendarIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Inventory as PackageIcon,
  LocalOffer as TagIcon,
  SupportAgent as UserCheckIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Brightness4 as Brightness4Icon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Chat as ChatIcon,
  Warning as WarningIcon
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  Select,
  InputBase,
  Tooltip,
  Badge,
  Fab,
  Zoom,
  LinearProgress,
  Breadcrumbs,
  Chip,
  Paper,
  alpha,
  ButtonGroup,
  Stack,
   Card, 
   CardContent
} from "@mui/material";

// Import your components
import AddTour from "../../pages/AddTour";
import PageTestComponent from "../../pages/PageTestComponent";
import BookingList from "../../pages/BookingList";
import AddDestination from "../../pages/AddDestination";
import UpdateTour from "../../pages/UpdateTour";
import UserInfo from "../../pages/UserInfo";
import AccountPage from "../../pages/AccountPage";
import DiscountPage from "../../pages/DiscountPage";
import CustomerPage from "../../pages/CustomerPage";
import TourGuidePage from "../../pages/TourGuidePage";
import TourGuideManagerPage from "../../pages/TourGuideManagerPage";
import AssignmentPage from "../../pages/AssignmentPage";
import TourGuideStats from "../statistical/TourGuideStats";
import TourStatisticsDashboard from "../statistical/TourStatisticsDashboard";
import NotifyComponent from "../notify/NotifyComponent";
import TourManagerPage from "../../pages/TourManagerPage";
import TourStatistics from "../tour/TourAgencyStatistics";
import RevenueDashboard from "../tour/RevenueDashboard";
import TourAgencyStatistics from "../tour/TourAgencyStatistics";
import BookingListComponent from "../booking/BookingListComponent";
const drawerWidth = 280;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(4);
  const [favorites, setFavorites] = useState([
    { name: "Thêm tour", path: "/admin/add-tour" },
    { name: "Đặt tour", path: "/admin/booking-list" },
  ]);

  const [userData, setUserData] = useState(() => {
    const user = JSON.parse(sessionStorage.getItem("user")) || {
      fullName: "Admin User",
      role: "Administrator",
      email: "admin@example.com",
    };
    return user;
  });
 const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    if (!userData || userData.role !== "ADMIN") {
      setIsAdmin(false); 
    }
  }, [userData]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      sessionStorage.clear();
      navigate("/login-register");
      setLoading(false);
    }, 1000);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate("/admin/user-detail");
  };

  const handleOpenSettings = () => {
    handleProfileMenuClose();
    setOpenSettings(true);
  };

  const navigation = [
    {
      id: "tour",
      name: "Quản lí tour",
      icon: <PackageIcon />,
      children: [
        { name: "Thêm tour", path: "/admin/add-tour" },
        { name: "Thêm địa điểm", path: "/admin/add-destination" },
        { name: "Danh sách tour", path: "/admin/tour-manager" },
      ],
    },
    {
      id: "booking",
      name: "Quản lí đặt tour",
      icon: <CalendarIcon />,
      children: [{ name: "Danh sách đặt tour", path: "/admin/booking-list" }],
    },
    {
      id: "user",
      name: "Quản lí người dùng",
      icon: <GroupIcon />,
      children: [
        { name: "Danh sách tài khoản", path: "/admin/account-list" },
        { name: "Danh sách khách hàng", path: "/admin/customer-list" },
      ],
    },
    {
      id: "guide",
      name: "Quản lí hướng dẫn viên",
      icon: <UserCheckIcon />,
      children: [
        { name: "Danh sách hướng dẫn viên", path: "/admin/tour-guide-manager" },
        { name: "Danh sách phân công", path: "/admin/list-assignment" },
      ],
    },
    {
      id: "promo",
      name: "Danh sách mã khuyến mãi",
      icon: <TagIcon />,
      children: [
        { name: "Danh sách mã khuyến mãi", path: "/admin/discount-list" },
      ],
    },
    {
      id: "statistics",
      name: "Thống kê",
      icon: <TagIcon />,
      children: [
        { name: "Thống kê HDV", path: "/admin/statis-tourguide" },
        { name: "Thống kê đánh giá tour", path: "/admin/statis-tour-reiview" },
        { name: "Thống kê tour đại lý", path: "/admin/statis-tour-provider" },
        { name: "Thống kê doanh thu", path: "/admin/revenue" },
      ],
    },
    {
      id: "notify",
      name: "Thông báo",
      icon: <ChatIcon />,
      children: [{ name: "Thông báo", path: "/admin/notify" }],
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? "" : menuId);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const getBreadcrumbName = (path) => {
    const currentPath = path.split("/").pop();
    const pathNameMap = {
      "add-tour": "Thêm tour",
      "booking-list": "Danh sách đặt tour",
      "add-destination": "Thêm địa điểm",
      "update-tour": "Cập nhật tour",
      "user-detail": "Thông tin người dùng",
      "account-list": "Danh sách tài khoản",
      "discount-list": "Danh sách mã khuyến mãi",
      "customer-list": "Danh sách khách hàng",
      "tour-guide": "Hướng dẫn viên",
      "tour-guide-manager": "Quản lý hướng dẫn viên",
      "list-assignment": "Danh sách phân công",
      "tour-manager": "Danh sách tour",
      "statis-tourguide": "Thống kê HDV",
      "statis-tour-reiview": "Thống kê đánh giá tour",
      "statis-tour-provider": "Thống kê tour đại lý",
      "revenue": "Thống kê doanh thu",
    };

    return (
      pathNameMap[currentPath] ||
      currentPath.charAt(0).toUpperCase() +
        currentPath.slice(1).replace("-", " ")
    );
  };
  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Card sx={{ maxWidth: 400, textAlign: "center", boxShadow: 3 }}>
          <CardContent>
            <WarningIcon sx={{ fontSize: 40, color: "warning.main" }} />
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Bạn không có quyền truy cập vào trang này.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng đăng nhập để tiếp tục.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/login-register")}
              sx={{ mt: 3 }}
            >
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }
  const drawer = (
    <Box
      sx={{
        overflow: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.primary.main,
          color: "white",
        }}
      >
        <DashboardIcon />
        <Typography variant="h6" component="div">
          Admin Dashboard
        </Typography>
      </Box>

      {/* Search Box */}
      <Box sx={{ p: 2 }}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <IconButton type="button" sx={{ p: "10px" }}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Quick Access */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 1, px: 1 }}
        >
          Truy cập nhanh
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {favorites.map((fav, index) => (
            <Chip
              key={index}
              label={fav.name}
              size="small"
              icon={<BookmarkIcon />}
              onClick={() => navigate(fav.path)}
              sx={{
                bgcolor: theme.palette.primary.lighter,
                "&:hover": {
                  bgcolor: theme.palette.primary.light,
                },
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 2 }}>
        {navigation.map((group) => (
          <Box key={group.id} sx={{ mb: 0.5 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(group.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                  ...(expandedMenu === group.id && {
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color:
                      expandedMenu === group.id
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  }}
                >
                  {group.icon}
                </ListItemIcon>
                <ListItemText
                  primary={group.name}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: expandedMenu === group.id ? 600 : 400,
                    color:
                      expandedMenu === group.id
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  }}
                />
                {expandedMenu === group.id ? (
                  <ExpandMoreIcon
                    sx={{
                      color: theme.palette.primary.main,
                      transition: "0.2s",
                    }}
                  />
                ) : (
                  <ChevronRightIcon />
                )}
              </ListItemButton>
            </ListItem>
            <Collapse
              in={expandedMenu === group.id}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {group.children.map((item, index) => (
                  <ListItemButton
                    key={index}
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      pl: 4,
                      py: 0.5,
                      borderRadius: 1,
                      mb: 0.5,
                      "&.Mui-selected": {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                        },
                      },
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: "0.815rem",
                        fontWeight: location.pathname === item.path ? 500 : 400,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>

      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
            }}
          >
            {userData.fullName ? userData.fullName.charAt(0) : <PersonIcon />}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {userData.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {userData.role}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleProfileMenuOpen}
            sx={{
              bgcolor: theme.palette.action.hover,
              "&:hover": {
                bgcolor: theme.palette.action.selected,
              },
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "background.paper",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Breadcrumbs */}
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              to="/admin"
              style={{
                textDecoration: "none",
                color: theme.palette.text.primary,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <DashboardIcon sx={{ fontSize: 20 }} />
              Bảng điều khiển
            </Link>
            {location.pathname !== "/admin" && (
              <Typography color="text.primary">
                {getBreadcrumbName(location.pathname)}
              </Typography>
            )}
          </Breadcrumbs>

          <Box sx={{ flexGrow: 1 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Notifications */}
            <Tooltip title="Thông báo">
              <IconButton color="inherit">
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Language Selector */}
            <Tooltip title="Ngôn ngữ">
              <IconButton color="inherit">
                <LanguageIcon />
              </IconButton>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip title="Chế độ tối">
              <IconButton color="inherit">
                <Brightness4Icon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
        {loading && <LinearProgress />}
      </AppBar>

      {/* Drawer - Mobile */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer - Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
        }}
      >
        <Toolbar /> {/* Spacing for AppBar */}
        {/* Welcome Message */}
        {/* <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {getGreeting()}, {userData.fullName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chào mừng trở lại với hệ thống quản lý
          </Typography>
        </Box> */}
        {/* Routes */}
        <Routes>
          {/* <Route path="/" element={<PageTestComponent />} /> */}
          <Route path="/add-tour" element={<AddTour />} />
          <Route path="/booking-list" element={<BookingListComponent />} />
          <Route path="/add-destination" element={<AddDestination />} />
          <Route path="/update-tour/:id" element={<UpdateTour />} />
          <Route path="/user-detail" element={<UserInfo />} />
          <Route path="/account-list" element={<AccountPage />} />
          <Route path="/discount-list" element={<DiscountPage />} />
          <Route path="/customer-list" element={<CustomerPage />} />
          <Route path="/tour-guide" element={<TourGuidePage />} />
          <Route
            path="/tour-guide-manager"
            element={<TourGuideManagerPage />}
          />
          <Route path="/list-assignment" element={<AssignmentPage />} />
          <Route path="/statis-tourguide" element={<TourGuideStats />} />
          <Route
            path="/statis-tour-reiview"
            element={<TourStatisticsDashboard />}
          />
          <Route
            path="/statis-tour-provider"
            element={<TourAgencyStatistics />}
          />
          <Route path="/revenue" element={<RevenueDashboard />} />
          <Route path="/notify" element={<NotifyComponent />} />
          <Route path="/tour-manager" element={<TourManagerPage />} />
        </Routes>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Thông tin cá nhân
        </MenuItem>
        <MenuItem onClick={handleOpenSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Cài đặt
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>

      {/* Settings Dialog */}
      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cài đặt</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <List>
              {/* Dark Mode Setting */}
              <ListItem>
                <ListItemIcon>
                  <Brightness4Icon />
                </ListItemIcon>
                <ListItemText
                  primary="Chế độ tối"
                  secondary="Thay đổi giao diện sáng/tối"
                />
                <Switch />
              </ListItem>

              {/* Language Setting */}
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Ngôn ngữ"
                  secondary="Chọn ngôn ngữ hiển thị"
                />
                <Select value="vi" size="small" sx={{ minWidth: 100 }}>
                  <MenuItem value="vi">Tiếng Việt</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </ListItem>

              {/* Notification Setting */}
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Thông báo"
                  secondary="Quản lý cài đặt thông báo"
                />
                <Switch defaultChecked />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettings(false)}>Hủy</Button>
          <Button variant="contained" onClick={() => setOpenSettings(false)}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="small"
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default AdminDashboard;
