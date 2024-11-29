import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  CircularProgress,
  Typography,
  Box,
  Paper,
  Fade,
  Pagination,
} from '@mui/material';
import TourCard from '../tourCard/TourCard';

const FavoriteTourListComponent = () => {
  const navigate = useNavigate();
  const [dataCard, setDataCard] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const fetchFavoriteTours = async (currentPage) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/favorite-tours/favorites/${user.userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorite tours');
      }
     
      const data = await response.json();
       console.log(data);
      if (data) {
        // Calculate pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = data.slice(startIndex, endIndex);
        
        setDataCard(paginatedData);
        setTotalPages(Math.ceil(data.length / pageSize));
      } else {
        setDataCard([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching favorite tours:', error);
      setDataCard([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchFavoriteTours(page);
    }
  }, [page]);

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
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                mb: 4, 
                textAlign: 'center',
                color: 'primary.main',
                fontWeight: 'bold'
              }}
            >
              Tour Yêu Thích
            </Typography>
            
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
                    Chưa có tour yêu thích
                  </Typography>
                  <Typography color="text.secondary">
                    Hãy thêm các tour bạn yêu thích vào danh sách này.
                  </Typography>
                </Paper>
              </Fade>
            ) : (
              <Grid container spacing={3}>
                {dataCard.map((tour, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={tour.tourId}>
                    <Fade in timeout={500 + index * 100}>
                      <Box>
                        <TourCard
                          tour={{
                            tourId: tour.tourId,
                            image: tour.imageUrl,
                            title: tour.tourName,
                            departureCity: tour.startLocation,
                            tourType: tour.tourType,
                            startDate: tour.startDate,
                            duration: `${tour.duration}N${tour.duration - 1}Đ`,
                            originalPrice: '8,490,000',
                            availableSeats: tour.availableSeats,
                            discountedPrice: tour.price,
                            favorite: true,
                          }}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
            {dataCard.length > 0 && (
              <Box display="flex" justifyContent="center" mt={6}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                  siblingCount={0}
                />
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default FavoriteTourListComponent;