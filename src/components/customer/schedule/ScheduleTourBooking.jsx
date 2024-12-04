import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Paper, 
  Tabs, 
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  useTheme,
  ThemeProvider,
  createTheme,
  Divider,
  IconButton,
  Button,
  Avatar,
   useMediaQuery
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { 
  TravelExplore as MapIcon, 
  CalendarMonth as CalendarIcon,
  TourOutlined as TourIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  DirectionsWalk as WalkIcon,
  PhotoCamera as CameraIcon,
  Restaurant as FoodIcon,
  Hotel as HotelIcon,
  NavigateNext as NextIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CalendarDialog from './CalendarDialog';
// Helper function to get coordinates for a location using OpenStreetMap Nominatim API
const getCoordinatesForLocation = async (locationName) => {
  try {
    // Encode location name for URL
    const encodedLocation = encodeURIComponent(locationName);
    
    // Call Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Không thể lấy tọa độ');
    }

    const data = await response.json();
    
    // Check if we got results
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

// Helper function to get route between two points using OSRM
const getRoute = async (start, end) => {
  try {
    if (!start || !end) return null;
    
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    );
    
    if (!response.ok) {
      throw new Error('Không thể lấy tuyến đường');
    }

    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    secondary: {
      main: '#FF4081',
      light: '#FF80AB',
      dark: '#F50057',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          '@media (min-width: 600px)': {
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          '@media (max-width: 600px)': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            fontSize: '0.75rem',
            height: 24,
          },
        },
      },
    },
  },
});

// Loading Component
const LoadingView = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    height="100vh"
    flexDirection="column"
    gap={3}
  >
    <CircularProgress 
      size={70} 
      thickness={4} 
      sx={{
        animation: 'pulse 1.5s ease-in-out infinite',
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(33, 150, 243, 0.7)',
          },
          '70%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 10px rgba(33, 150, 243, 0)',
          },
          '100%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(33, 150, 243, 0)',
          },
        },
      }}
    />
    <Typography 
      variant="h6" 
      color="primary"
      sx={{ 
        fontWeight: 500,
        textAlign: 'center',
        animation: 'fadeIn 1.5s infinite alternate',
        '@keyframes fadeIn': {
          '0%': { opacity: 0.6 },
          '100%': { opacity: 1 },
        },
      }}
    >
      Đang tải lịch trình của bạn...
    </Typography>
  </Box>
);

// Timeline View Component
const TimelineView = ({ itineraries }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const isTourPassed = (date) => {
    return new Date(date) < new Date();
  };

  return (
    <Timeline position={isMobile ? "right" : "alternate"}
      sx={{
        [`& .MuiTimelineItem-root`]: {
          minHeight: isMobile ? 'auto' : '150px',
        },
        [`& .MuiTimelineContent-root`]: {
          px: isMobile ? 2 : 3,
        },
      }}>
      {itineraries.map((tour, index) => (
        <Zoom in={true} style={{ transitionDelay: `${index * 150}ms` }}>
          <TimelineItem key={tour.tourId}>
            <TimelineOppositeContent sx={{ 
              flex: isMobile ? 0.2 : 0.3,
              display: 'block'
            }}>
              {!isMobile ? (
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TimeIcon color="primary" />
                    <Typography variant="subtitle2">
                      {formatDate(tour.departures[0].startDate)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon color="primary" />
                    <Typography variant="body2">
                      {tour.maxGroupSize} người
                    </Typography>
                  </Box>
                </Box>
              ) : (
                // Mobile view
                <Typography variant="caption" color="textSecondary" sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.75rem'
                }}>
                  <TimeIcon sx={{ fontSize: '1rem' }} />
                  {formatDate(tour.departures[0].startDate)}
                </Typography>
              )}
            </TimelineOppositeContent>
            
            {/* Rest of the TimelineItem content remains the same */}
            <TimelineSeparator>
              <TimelineDot 
                sx={{ 
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  p: isMobile ? 1 : 2,
                }}
              >
                <TourIcon fontSize={isMobile ? "small" : "medium"} />
              </TimelineDot>
              {index < itineraries.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            
            <TimelineContent sx={{ py: isMobile ? 2 : 3, px: isMobile ? 2 : 3 }}>
              <Box 
                sx={{
                   background: '#fff',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transform: 'translateZ(0)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateZ(0) scale(1.02)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  },
                  p: isMobile ? 2 : 3,
                  '@media (max-width: 600px)': {
                    '& .MuiTypography-h6': {
                      fontSize: '1rem',
                    },
                    '& .MuiTypography-body2': {
                      fontSize: '0.8rem',
                    },
                  },
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                      textDecoration: isTourPassed(tour.departures[0].startDate) ? 'line-through' : 'none',
                      opacity: isTourPassed(tour.departures[0].startDate) ? 0.7 : 1,
                    }}
                  >
                    {tour.tourName}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocationIcon color="primary" />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            textDecoration: isTourPassed(tour.departures[0].startDate) ? 'line-through' : 'none',
                            opacity: isTourPassed(tour.departures[0].startDate) ? 0.7 : 1,
                          }}
                        >
                          {tour.destinations.map((dest, i) => (
                            <span key={dest.destinationId}>
                              {dest.name}
                              {i < tour.destinations.length - 1 && (
                                <NextIcon sx={{ mx: 0.5, fontSize: 16, verticalAlign: 'middle' }} />
                              )}
                            </span>
                          ))}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tour.destinations.map((dest) => (
                          <Chip
                            key={dest.destinationId}
                            label={dest.name}
                            icon={<LocationIcon />}
                            sx={{
                              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                              color: 'white',
                              opacity: isTourPassed(tour.departures[0].startDate) ? 0.7 : 1,
                              '& .MuiSvgIcon-root': {
                                color: 'white',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Chip
                            size="small"
                            icon={<WalkIcon />}
                            label="Hoạt động"
                            variant="outlined"
                            color="primary"
                            sx={{
                              opacity: isTourPassed(tour.departures[0].startDate) ? 0.7 : 1,
                            }}
                          />
                          <Chip
                            size="small"
                            icon={<HotelIcon />}
                            label="Khách sạn"
                            variant="outlined"
                            color="primary"
                            sx={{
                              opacity: isTourPassed(tour.departures[0].startDate) ? 0.7 : 1,
                            }}
                          />
                          <Chip
                            size="small"
                            icon={<FoodIcon />}
                            label="Ẩm thực"
                            variant="outlined"
                            color="primary"
                            sx={{
                              opacity: isTourPassed(tour.departures[0].startDate) ? 0.7 : 1,
                            }}
                          />
                        </Box>
                        <IconButton 
                          color="primary"
                          sx={{ 
                            background: 'rgba(33, 150, 243, 0.1)',
                            '&:hover': {
                              background: 'rgba(33, 150, 243, 0.2)',
                            },
                            opacity: isTourPassed(tour.departures[0].startDate) ? 0.7 : 1,
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </TimelineContent>
          </TimelineItem>
        </Zoom>
      ))}
    </Timeline>
  );
};

// Map View Component
const MapView = ({ destinations, routes }) => {
  const theme = useTheme();
  
  const getColor = (index) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      '#4CAF50',
      '#FFC107',
      '#9C27B0',
      '#FF5722'
    ];
    return colors[index % colors.length];
  };

  return (
    <Card 
      elevation={4}
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        height: '70vh',
      }}
    >
      <MapContainer 
        center={[16.0544, 108.2772]}
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {Object.entries(routes).map(([tourName, tourRoutes], tourIndex) => (
          tourRoutes.map((route, routeIndex) => (
            <Polyline
              key={`${tourName}-${routeIndex}`}
              positions={route}
              color={getColor(tourIndex)}
              weight={4}
              opacity={0.7}
              dashArray="5, 10"
            >
              <Popup>
                <Typography variant="subtitle2" color="primary">
                  {tourName}
                </Typography>
              </Popup>
            </Polyline>
          ))
        ))}

        {destinations.map((dest, index) => (
          <Marker 
            key={index}
            position={dest.coordinates}
          >
            <Popup>
              <Box sx={{ p: 1, minWidth: 200 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'primary.main',
                    borderBottom: '2px solid',
                    borderImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light}) 1`,
                    pb: 1,
                    mb: 1,
                  }}
                >
                  {dest.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {dest.tourName}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon fontSize="small" color="primary" />
                  <Typography variant="caption">
                    {formatDate(dest.startDate)} - {formatDate(dest.endDate)}
                  </Typography>
                </Box>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
};

// Main Component
const ScheduleTourBooking = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const [routes, setRoutes] = useState({});
const [openCalendar, setOpenCalendar] = useState(false);
 const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const userId = user.userId;
        const response = await fetch(`http://localhost:8080/api/bookings/itinerary/${userId}`);
        
        if (!response.ok) {
          throw new Error('Không thể tải lịch trình');
        }

        const data = await response.json();
        setItineraries(data.itinerary);
        
        // Fetch destinations and coordinates
        const destinationsWithCoordinates = await Promise.all(
          data.itinerary.flatMap(tour =>
            tour.destinations.map(async (dest, index) => {
              const coordinates = await getCoordinatesForLocation(dest.name);
              return {
                name: dest.name,
                coordinates,
                tourName: tour.tourName,
                order: index + 1,
                startDate: tour.departures[0].startDate,
                endDate: tour.departures[0].endDate
              };
            })
          )
        );
        
setDestinations(destinationsWithCoordinates.filter(dest => dest.coordinates !== null));
        
        // Calculate routes
        const routesData = {};
        const tourGroups = destinationsWithCoordinates.reduce((groups, dest) => {
          if (!groups[dest.tourName]) {
            groups[dest.tourName] = [];
          }
          groups[dest.tourName].push(dest);
          return groups;
        }, {});

        for (const [tourName, tourDests] of Object.entries(tourGroups)) {
          const sortedDestinations = tourDests
            .filter(dest => dest.coordinates)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          
          const tourRoutes = [];
          for (let i = 0; i < sortedDestinations.length - 1; i++) {
            const route = await getRoute(
              sortedDestinations[i].coordinates,
              sortedDestinations[i + 1].coordinates
            );
            if (route) {
              tourRoutes.push(route);
            }
          }
          
          routesData[tourName] = tourRoutes;
        }
        
        setRoutes(routesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItinerary();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) return <LoadingView />;

  if (error) return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
      px={3}
    >
      <Fade in={true}>
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ 
            maxWidth: 400,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          }
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Đã xảy ra lỗi
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Fade>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: isMobile ? 2 : 4,
          px: isMobile ? 1 : 3 
        }}
      >
        <Fade in={true}>
          <Box>
            {/* Header Section */}
            <Box
              elevation={0}
              sx={{
                background: 'linear-gradient(120deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: 4,
                p: isMobile ? 2 : { xs: 3, md: 4 },
                mb: isMobile ? 2 : 4,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
                  backgroundSize: '64px 64px',
                  animation: 'move-bg 3s linear infinite',
                  '@keyframes move-bg': {
                    '0%': {
                      backgroundPosition: '0 0',
                    },
                    '100%': {
                      backgroundPosition: '64px 64px',
                    },
                  },
                }}
              />
              
              <Box sx={{ position: 'relative' }}>
                <Typography
                   variant={isMobile ? "h5" : "h4"}
                  component="h1"
                  gutterBottom
                  align="center"
                  sx={{
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: isMobile ? '1.5rem' : undefined,
                  }}
                >
                  Lịch Trình Tour Của Bạn
                </Typography>
                <Typography
                  variant="subtitle1"
                  align="center"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    maxWidth: 600,
                    mx: 'auto',
                  }}
                >
                  Khám phá hành trình tuyệt vời đang chờ đợi bạn qua timeline và bản đồ tương tác
                </Typography>

                {/* Quick Stats */}
                <Grid   
                container 
                spacing={isMobile ? 1 : 2} 
                sx={{ 
                  mt: isMobile ? 2 : 3,
                  '& .MuiPaper-root': {
                    p: isMobile ? 1.5 : 2,
                  },
                }}>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        color: 'white',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <TourIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{itineraries.length}</Typography>
                          <Typography variant="body2">Tours</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        color: 'white',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <LocationIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{destinations.length}</Typography>
                          <Typography variant="body2">Điểm đến</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                 <Grid item xs={12} sm={4}>
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      color: 'white',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    }}
    onClick={() => setOpenCalendar(true)}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar sx={{ bgcolor: 'primary.light' }}>
        <CalendarIcon />
      </Avatar>
      <Box>
        <Typography variant="h6">
          {formatDate(itineraries[0]?.departures[0]?.startDate)}
        </Typography>
        <Typography variant="body2">Khởi hành</Typography>
      </Box>
    </Box>
  </Paper>
</Grid>
                </Grid>
              </Box>
            </Box>

            {/* Tabs Section */}
            <Box
              elevation={4}
              sx={{
                borderRadius: 3,
                mb: isMobile ? 2 : 4,
                overflow: 'hidden',
                background: 'white',
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                sx={{
                  '& .MuiTab-root': {
                    py: isMobile ? 1.5 : 3,
                    minHeight: isMobile ? 48 : 72,
                    fontSize: isMobile ? '0.8rem' : undefined,
                  },
                }}
              >
                <Tab
                  icon={<CalendarIcon />}
                  label="Timeline"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                />
                <Tab
                  icon={<MapIcon />}
                  label="Bản Đồ"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                />
              </Tabs>
            </Box>

            {/* Content Section */}
            <Box sx={{  
               minHeight: isMobile ? '40vh' : '60vh',
              '& .MuiTimelineItem-root': {
                flexDirection: isMobile ? 'column' : undefined,
              }, }}>
              {tabValue === 0 && (
                <Fade in={true}>
                  <div>
                    <TimelineView itineraries={itineraries} />
                  </div>
                </Fade>
              )}
              {tabValue === 1 && (
                <Fade in={true}>
                  <div>
                    <MapView destinations={destinations} routes={routes} />
                  </div>
                </Fade>
              )}
            </Box>
          </Box>
        </Fade>
      </Container>
      <CalendarDialog
  open={openCalendar}
  onClose={() => setOpenCalendar(false)}
  itineraries={itineraries}
/>
    </ThemeProvider>
  );
};

export default ScheduleTourBooking;