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
import TourCard from './TourCard';
import { getAllTourTest } from "../../functions/getAllTourTest";

const TourListComponent = ({ searchParams, showFavorites = false }) => {
  const navigate = useNavigate();
  const [dataCard, setDataCard] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTours = async (currentPage) => {
    setLoading(true);
    try {
      const hasFilters = Object.values(searchParams).some(param => param);
      const user = JSON.parse(sessionStorage.getItem('user'));
      const params = {
        page: currentPage - 1,
        size: pageSize,
        ...hasFilters ? searchParams : {},
      };
      if (user && user.userId) {
        params.userId = user.userId;
      }

      const data = await getAllTourTest(params);
      console.log(data);
      if (data && data.content) {
        // Lọc tour yêu thích nếu showFavorites được bật
        const filteredTours = showFavorites 
          ? data.content.filter(tour => Boolean(tour.favorite))
          : data.content;
        console.log(filteredTours);
        setDataCard(filteredTours);
        
        // Tính toán lại số trang dựa trên số lượng tour sau khi lọc
        const filteredTotalPages = showFavorites 
          ? Math.ceil(filteredTours.length / pageSize)
          : data.page.totalPages || 1;
        
        setTotalPages(filteredTotalPages || 1);
      } else {
        setDataCard([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setDataCard([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours(page);
  }, [page, searchParams, showFavorites]);

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
                    {showFavorites ? 'Không có tour yêu thích' : 'Không có kết quả'}
                  </Typography>
                  <Typography color="text.secondary">
                    {showFavorites 
                      ? 'Bạn chưa có tour yêu thích nào.'
                      : 'Vui lòng thử tìm kiếm lại với các tiêu chí khác.'}
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
                            favorite: Boolean(tour.favorite),  
                          }}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
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
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default TourListComponent;