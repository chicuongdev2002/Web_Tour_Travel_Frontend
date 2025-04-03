import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Button,
  MenuItem,
  Avatar,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  AccountCircle,
  AdminPanelSettings,
  BarChart,
  Add,
  ListAlt,
  CalendarToday,
  Favorite,
  ExitToApp,
  Login,
  Menu as MenuIcon,
  Home,
  Info,
  Tour,
  CheckCircle,
} from '@mui/icons-material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import title from "../../assets/title.png";
import brand from "../../assets/logo.png";
const NavHeader = () => {
  const [user, setUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && !parsedUser.active) {
          toast.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
        }
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");
      setUser(null);
      navigate("/");
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      console.error("Logout error:", error);
      sessionStorage.clear();
      setUser(null);
      navigate("/");
    }
  };

  const navItems = [
    { label: 'Trang chủ', icon: <Home />, path: '/' },
    { label: 'Giới thiệu', icon: <Info />, path: '/about' },
    { label: 'Đặt tour', icon: <Tour />, path: '/tour-list' }
  ];
 const userMenuItems = [
    {
      title: "Thông tin khách hàng",
      onClick: () => navigate("/user-detail"),
      icon: <AccountCircle />,
      roles: ["CUSTOMER", "CUSTOMERVIP", "ADMIN", "TOURPROVIDER", "TOURGUIDE"]
    },
    {
      title: "Trang dành cho admin",
      onClick: () => navigate("/admin"),
      icon: <AdminPanelSettings />,
      roles: ["ADMIN"]
    },
    {
      title: "Thống kê tour",
      onClick: () => navigate("/provider-detail"),
      icon: <BarChart />,
      roles: ["TOURPROVIDER"]
    },
    {
      title: "Quản lý tour",
      onClick: () => navigate("/provider-manager"),
      icon: <ApartmentIcon />,
      roles: ["TOURPROVIDER"]
    },
    {
      title: "Đăng bán tour",
      onClick: () => navigate("/add-tour"),
      icon: <Add />,
      roles: ["TOURPROVIDER"]
    },
    {
      title: "Danh sách đơn đặt tour",
      onClick: () => navigate("/booking-list"),
      icon: <ListAlt />,
      roles: ["CUSTOMER", "CUSTOMERVIP"]
    },
    {
      title: "Tour yêu thích",
      onClick: () => navigate("/favorite-tour"),
      icon: <Favorite />,
      roles: ["CUSTOMER", "CUSTOMERVIP", "ADMIN", "TOURPROVIDER", "TOURGUIDE"]
    },
    {
      title: "Lịch trình xuất phát",
      onClick: () => navigate("/schedule-tour-booking"),
      icon: <CalendarToday />,
      roles: ["CUSTOMER", "CUSTOMERVIP", "ADMIN", "TOURPROVIDER", "TOURGUIDE"]
    },
    {
      title: "Xem thông tin phân công",
       onClick: () => navigate("/tour-guide-assiment"),
      icon: <ListAlt className="mr-2 gradient-icon" />,
         roles: ["TOURGUIDE"]
    
    },
    {
       title: "Checkin khách hàng",
        onClick: () => navigate("/checkin"),
      icon: <CheckCircle className="mr-2 gradient-icon" />,
    roles: ["TOURGUIDE"]
    },
    {
       title: "Lịch trình HDV",
                onClick: () => navigate("/schedule-tour-guide"),
                icon: <CalendarToday className="mr-2 gradient-icon" />,
                  roles: ["TOURGUIDE"]
    }

  ];

  return (
    <Box 
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        // background: isScrolled 
        //   ? 'rgba(255, 255, 255, 0.95)' 
        //   : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        boxShadow: isScrolled 
          ? '0 4px 15px rgba(0,0,0,0.1)' 
          : 'none',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Container 
        maxWidth={false} 
        sx={{ 
          px: { xs: 2, md: 4, lg: 6 },
          width: '100%',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: { xs: 64, md: 80 },
            py: { xs: 0.5, md: 1 },
          }}
        >
          {/* Logo and Navigation Section */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={{ xs: 1, md: 3 }}
          >
            {/* Logo */}
            <Box 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05) rotate(2deg)'
                }
              }}
              onClick={() => navigate('/')}
            >
                 <img
                src={brand}
                alt="Brand"
                style={{ 
                  height: isMobile ? 40 : 50, 
                  width: 'auto',
                  filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.15))'
                }}
              />
              <img
                src={title}
                alt="Logo"
                style={{ 
                  height: isMobile ? 40 : 50, 
                  width: 'auto',
                  filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.15))'
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                gap: 2,
                ml: { md: 2, lg: 4 }
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => item.path && navigate(item.path)}
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    px: 2,
                    position: 'relative',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                      '&::after': {
                        width: '100%',
                      }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: '0%',
                      height: '3px',
                      backgroundColor: 'primary.main',
                      transition: 'width 0.3s ease-in-out'
                    }
                  }}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Stack>

          {/* User Actions Section */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={{ xs: 1, md: 2 }}
          >
            {/* User Menu or Login Button */}
            {user ? (
              <Box>
                <Tooltip title="Tài khoản">
                  <IconButton 
                    onClick={handleOpenUserMenu}
                    sx={{
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        width: { xs: 36, md: 42 },
                        height: { xs: 36, md: 42 },
                        boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                        fontWeight: 600
                      }}
                    >
                      {user.fullName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      width: 280,
                      mt: 1.5,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                      '& .MuiList-root': { py: 1 },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user.fullName}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                      {user.role}
                    </Typography> */}
                  </Box>
                  <Divider />
                  {userMenuItems
                    .filter(item => item.roles.includes(user.role))
                    .map((item) => (
                      <MenuItem
                        key={item.title}
                        onClick={() => {
                          item.onClick();
                          handleCloseUserMenu();
                        }}
                        sx={{
                          py: 1.5,
                          px: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            transform: 'translateX(5px)'
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          {React.cloneElement(item.icon, { 
                            sx: { color: 'primary.main' } 
                          })}
                          <Typography>{item.title}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  <Divider />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.5,
                      px: 2,
                      color: 'error.main',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'error.lighter',
                        transform: 'translateX(5px)'
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <ExitToApp />
                      <Typography>Đăng xuất</Typography>
                    </Stack>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Login />}
                onClick={() => navigate("/login-register")}
                sx={{
                  borderRadius: '30px',
                  px: { xs: 2, md: 3 },
                  py: { xs: 0.8, md: 1 },
                  textTransform: 'none',
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Đăng nhập
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ 
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: 300,
                  }
                }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => {
                      handleCloseNavMenu();
                      if (item.path) navigate(item.path);
                    }}
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'translateX(5px)'
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {item.icon}
                      <Typography>{item.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Stack>
        </Toolbar>
      </Container>
    </Box>
  );
};

export default NavHeader;