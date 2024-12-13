import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavHeader from "../components/navbar/NavHeader";
import SearchInput from "../components/search/SearchInput";
import {
  ThemeProvider,
  createTheme,
  Container,
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Fade,
  useScrollTrigger,
  Button,
  Grid,
  Stack,
  useMediaQuery,
  IconButton,
  Drawer,
  Divider,
} from "@mui/material";
import TourListComponent from "../components/tourCard/TourListComponent";
import TourListFavoriteComponent from "../components/tourfavorite/TourListFavoriteComponent";
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FilterList as FilterListIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import TopTours from "../components/tour/TopTours";
import ContactLinks from "../components/contact/ContactLinks";

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    subtitle1: {
      fontSize: "1rem",
      color: "#64748b",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow:
              "0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          minHeight: 48,
          padding: "12px 24px",
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        {children}
      </Box>
    </Fade>
  );
}

function SearchPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const tourListRef = useRef(null);
  const favoriteListRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    if (location.state?.keyword) {
      setSearchParams({
        ...searchParams,
        keyword: location.state.keyword,
      });
    }
  }, [location.state]);
  const handleSearch = (params) => {
    setSearchParams(params);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    const targetRef = newValue === 0 ? tourListRef : favoriteListRef;
    targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  const Sidebar = () => (
    <Stack spacing={3}>
      <Box>
        <SearchInput onSearch={handleSearch} />
      </Box>
      <Divider />
      <Box>
        <Typography variant="h6" gutterBottom>
          Tour nổi bật
        </Typography>
        <TopTours />
      </Box>
    </Stack>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          // background: "linear-gradient(to bottom, #00aaff, #e0f7fa)",
          minHeight: "100vh",
          pt: 2,
          overflowY: "auto",
        }}
      >
        <style>
          {`
            /* Tùy chỉnh thanh cuộn cho tất cả các trình duyệt */
            ::-webkit-scrollbar {
              width: 1px; /* Chiều rộng thanh cuộn nhỏ hơn */
            }
            ::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.05); /* Màu nền của thanh cuộn */
              border-radius: 10px; /* Bo tròn các góc */
            }
            ::-webkit-scrollbar-thumb {
              background: rgba(30, 144, 255, 0.5); /* Màu thanh cuộn mờ hơn */
              border-radius: 10px; /* Bo tròn các góc */
            }
            ::-webkit-scrollbar-thumb:hover {
              background: rgba(30, 144, 255, 0.8); /* Màu khi hover */
            }
            /* Dành cho Firefox */
            * {
              scrollbar-width: thin; /* Kích thước thanh cuộn */
              scrollbar-color: rgba(30, 144, 255, 0.5) rgba(0, 0, 0, 0.05); /* Màu thanh cuộn và hậu cảnh */
            }
          `}
        </style>
        <NavHeader textColor="black" />
        <Container maxWidth="xl">
          <ContactLinks />
          {isMobile && (
            <Button
              startIcon={<FilterListIcon />}
              variant="outlined"
              onClick={() => setDrawerOpen(true)}
              sx={{ mb: 2 }}
              fullWidth
            >
              Mở bộ lọc tìm kiếm
            </Button>
          )}

          <Grid container spacing={3}>
            {/* Left Sidebar - Desktop */}
            {!isMobile && (
              <Grid item md={3} lg={2.5}>
                <Paper
                  sx={{
                    p: 3,
                    position: "sticky",
                    top: 80,
                    maxHeight: "calc(100vh - 100px)",
                    overflowY: "auto",
                    background: "linear-gradient(to bottom, #00aaff, #e0f7fa)",
                  }}
                >
                  <Sidebar />
                </Paper>
              </Grid>
            )}

            {/* Mobile Drawer */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  width: "85%",
                  maxWidth: 360,
                  p: 2,
                },
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Bộ lọc tìm kiếm</Typography>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Sidebar />
            </Drawer>

            {/* Main Content */}
            <Grid item xs={12} md={9} lg={9.5}>
              <Paper sx={{ mb: 3 }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    "& .MuiTabs-indicator": {
                      height: 3,
                    },
                  }}
                >
                  <Tab
                    icon={<SearchIcon />}
                    iconPosition="start"
                    label="Danh sách tour"
                  />
                  <Tab
                    icon={<FavoriteIcon />}
                    iconPosition="start"
                    label="Tour yêu thích"
                  />
                </Tabs>
              </Paper>

              <Box sx={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
                <Box ref={tourListRef}>
                  <Typography variant="h4" gutterBottom>
                    Khám phá chuyến đi của bạn
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 4 }}>
                    Tìm kiếm và đặt tour du lịch phù hợp với sở thích của bạn
                  </Typography>
                  <TourListComponent searchParams={searchParams} />
                </Box>

                <Box ref={favoriteListRef}>
                  <TourListFavoriteComponent />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <ScrollTop>
          <Button
            variant="contained"
            color="primary"
            sx={{
              minWidth: "auto",
              width: 48,
              height: 48,
              borderRadius: "50%",
              boxShadow: theme.shadows[4],
            }}
          >
            <KeyboardArrowUpIcon />
          </Button>
        </ScrollTop>
      </Box>
    </ThemeProvider>
  );
}

export default SearchPage;
