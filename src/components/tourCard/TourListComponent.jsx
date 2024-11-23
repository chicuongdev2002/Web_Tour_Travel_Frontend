import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Button,
  CircularProgress,
  Typography,
  Box,
  Paper,
  Fade,
  ThemeProvider,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TourCard from './TourCard'
import theme from './theme';
import { getAllTourTest } from "../../functions/getAllTourTest";
const TourListComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dataCard, setDataCard] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useState(location.state?.searchParams || {});

  const fetchTours = async (currentPage) => {
    setLoading(true);
    try {
      const data = await getAllTourTest({
        page: currentPage - 1,
        size: pageSize,
      });
      setDataCard(data.content);
      setTotalPages(data.page.totalPages);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours(page);
  }, [page, searchParams]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <div>
      {/* <NavHeader textColor="black" /> */}
      <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          pt: 4,
          pb: 8,
        }}
      >
        <Container maxWidth="lg">
     
          <Fade in timeout={800}>
            <Box>
              {/* <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mb: 6,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/add-tour')}
                  sx={{
                    background: 'linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1d4ed8 30%, #3b82f6 90%)',
                    },
                  }}
                >
                  Thêm tour
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/add-destination')}
                  sx={{
                    background: 'linear-gradient(45deg, #ec4899 30%, #f472b6 90%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #db2777 30%, #ec4899 90%)',
                    },
                  }}
                >
                  Thêm điểm du lịch
                </Button>
              </Box> */}

              {dataCard.length === 0 ? (
                <Fade in timeout={800}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 6,
                      textAlign: 'center',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography variant="h5" gutterBottom color="primary">
                      Không có kết quả
                    </Typography>
                    <Typography color="text.secondary">
                      Vui lòng thử tìm kiếm lại với các tiêu chí khác.
                    </Typography>
                  </Paper>
                </Fade>
              ) : (
                <Grid container spacing={3}>
                  {dataCard.map((tour, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Fade in timeout={500 + index * 100}>
                        <Box>
                          <TourCard
                            tour={{
                              tourId: tour.tourId,
                              image: tour.imageUrl,
                              title: tour.tourName,
                              departureCity: tour.startLocation,
                              startDate: tour.startDate,
                              duration: `${tour.duration}N${tour.duration - 1}Đ`,
                              originalPrice: '8,490,000',
                              availableSeats: tour.availableSeats,
                              discountedPrice: tour.price,
                            }}
                          />
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Box
                display="flex"
                justifyContent="center"
                mt={6}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '1rem',
                      '&.Mui-selected': {
                        background: 'linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1d4ed8 30%, #3b82f6 90%)',
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
    </div>
  
  );
};

export default TourListComponent;