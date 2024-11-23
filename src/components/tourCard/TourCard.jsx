import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const TourCard = ({ tour }) => {
  const navigate = useNavigate();

  const handleViewDetail = (e) => {
    e.preventDefault();
    if (!tour?.tourId) {
      console.error('Tour ID is missing');
      return;
    }
    try {
      const tourIdString = tour.tourId.toString();
      navigate(`/tour-details/${tourIdString}`, {
        replace: false,
        state: { tourData: tour }
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (!tour) return null;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 25px 30px -12px rgba(0, 0, 0, 0.15)',
          '& .MuiCardMedia-root': {
            transform: 'scale(1.1)',
          },
          '& .overlay': {
            opacity: 1,
          },
          '& .action-buttons': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
      }}
      onClick={handleViewDetail}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="240"
          image={tour.image}
          alt={tour.title}
          sx={{
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        {/* Gradient overlay */}
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
        
        {/* Top actions */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            display: 'flex',
            justifyContent: 'space-between',
            zIndex: 2,
          }}
        >
          <Chip
            icon={<EventSeatIcon sx={{ color: 'white !important' }} />}
            label={`Còn ${tour.availableSeats} chỗ`}
            sx={{
              background: 'linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)',
              color: 'white',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.2)',
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
          <Box className="action-buttons" sx={{
            display: 'flex',
            gap: 1,
            transform: 'translateY(-20px)',
            opacity: 0,
            transition: 'all 0.3s ease-in-out',
          }}>
            <Tooltip title="Yêu thích">
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    bgcolor: 'white',
                  },
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <FavoriteIcon sx={{ color: '#ef4444' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chia sẻ">
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    bgcolor: 'white',
                  },
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <ShareIcon sx={{ color: '#3b82f6' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.2rem',
            mb: 2.5,
            height: '2.8em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            background: 'linear-gradient(45deg, #1e293b, #334155)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.01em',
          }}
        >
          {tour.title}
        </Typography>

        <Stack spacing={2.5}>
          <Box display="flex" alignItems="center" gap={2}>
            <LocationOnIcon sx={{ color: '#2563eb', fontSize: '1.3rem' }} />
            <Typography
              variant="body2"
              sx={{
                color: '#475569',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              {tour.departureCity}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <CalendarTodayIcon sx={{ color: '#2563eb', fontSize: '1.3rem' }} />
            <Typography
              variant="body2"
              sx={{
                color: '#475569',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              {tour.startDate}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <AccessTimeIcon sx={{ color: '#2563eb', fontSize: '1.3rem' }} />
            <Typography
              variant="body2"
              sx={{
                color: '#475569',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              {tour.duration}
            </Typography>
          </Box>
        </Stack>

        <Box mt={3.5}>
          <Typography
            variant="body2"
            sx={{
              textDecoration: 'line-through',
              color: '#94a3b8',
              fontSize: '0.9rem',
              marginBottom: '4px',
            }}
          >
            {tour.originalPrice} đ
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #dc2626, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.4rem',
              letterSpacing: '-0.02em',
            }}
          >
            {tour.discountedPrice} đ
          </Typography>
        </Box>
      </CardContent>

      <Box p={3} pt={0}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleViewDetail}
          sx={{
            background: 'linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)',
            color: 'white',
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            textTransform: 'none',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1), 0 2px 4px -1px rgba(37, 99, 235, 0.06)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1d4ed8 30%, #3b82f6 90%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 12px -3px rgba(37, 99, 235, 0.2), 0 4px 6px -2px rgba(37, 99, 235, 0.1)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Xem chi tiết
        </Button>
      </Box>
    </Card>
  );
};

export default TourCard;