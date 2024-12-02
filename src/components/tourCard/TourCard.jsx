import React, { useState } from 'react';
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
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import GroupIcon from '@mui/icons-material/Group';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import img from '../../assets/404.png';
import { addFavoriteTour } from '../../functions/addFavoriteTour';
import { deleteFavoriteTour } from '../../functions/deleteFavoriteTour';
import './TourCard.css'
import ChoosePopup from '../popupNotifications/ChoosePopup';
const TourCard = ({ tour }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(Boolean(tour.favorite));
 const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleViewDetail = (e) => {
    e.preventDefault();
    if (!tour?.tourId) {
      console.error('Tour ID is missing');
      return;
    }
    navigate(`/tour-details/${tour.tourId}`, {
      replace: false,
      state: { tourData: tour },
    });
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user || !user.userId) {
      // Show popup if the user is not logged in
      setIsPopupOpen(true);
      return;
    }

    try {
      if (isFavorite) {
        await deleteFavoriteTour(user.userId, tour.tourId);
        setIsFavorite(false);
      } else {
        await addFavoriteTour(user.userId, tour.tourId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite tour:', error);
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handlePopupAccept = () => {
    setIsPopupOpen(false);
    navigate('/login-register');
  };

  const handleShare = (e) => {
    e.stopPropagation();
    console.log('Share tour:', tour.title);
  };

  const getTourTypeDetails = (type) => {
    switch (type) {
      case 'GROUP':
        return { label: 'Tour Nhóm', icon: <GroupIcon sx={{ color: '#2563eb', fontSize: '1.3rem', mr: 1 }} /> };
      case 'FAMILY':
        return { label: 'Tour Gia Đình', icon: <FamilyRestroomIcon sx={{ color: '#2563eb', fontSize: '1.3rem', mr: 1 }} /> };
      default:
        return { label: 'Chưa xác định', icon: null };
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (!tour) return null;

  const tourTypeDetails = getTourTypeDetails(tour.tourType);
  const discountPercentage = Math.round((1 - tour.discountedPrice / tour.originalPrice) * 100);

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      style={{ height: '100%' }}
    >
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
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
          },
        }}
        onClick={handleViewDetail}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="240"
            image={tour.image ? tour.image : img}
            alt={tour.title}
            sx={{
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.1)',
              },
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
            <Box
              sx={{
                display: 'flex',
                gap: 1,
              }}
            >
              <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      bgcolor: 'white',
                    },
                  }}
                  onClick={handleFavoriteToggle}
                >
                  {isFavorite ? (
                    <FavoriteIcon sx={{ color: '#ef4444' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: '#94a3b8' }} />
                  )}
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
                  onClick={handleShare}
                >
                  <ShareIcon sx={{ color: '#3b82f6' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3, pt: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.2rem',
              mb: 2,
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
              transition: 'color 0.3s ease',
            }}
          >
            {tour.title}
          </Typography>

          <Stack spacing={2}>
            {/* Location */}
            <Box display="flex" alignItems="center" gap={1.5}>
              <LocationOnIcon sx={{ color: '#2563eb', fontSize: '1.2rem', opacity: 0.8 }} />
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

            {/* Tour Type */}
            <Box display="flex" alignItems="center" gap={1.5}>
              {tourTypeDetails.icon}
              <Typography
                variant="body2"
                sx={{
                  color: '#475569',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {tourTypeDetails.label}
              </Typography>
            </Box>

            {/* Start Date */}
            <Box display="flex" alignItems="center" gap={1.5}>
              <CalendarTodayIcon sx={{ color: '#2563eb', fontSize: '1.2rem', opacity: 0.8 }} />
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

            {/* Duration */}
            <Box display="flex" alignItems="center" gap={1.5}>
              <AccessTimeIcon sx={{ color: '#2563eb', fontSize: '1.2rem', opacity: 0.8 }} />
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

          {/* Pricing */}
          <Box mt={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: 'line-through',
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    marginBottom: '4px',
                  }}
                >
                  {formatPrice(tour.originalPrice)} đ
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#dc2626',
                      fontSize: '1.4rem',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {formatPrice(tour.discountedPrice)} đ
                  </Typography>
                  {discountPercentage > 0 && (
                    <Chip
                      label={`-${discountPercentage}%`}
                      size="small"
                      sx={{
                        background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
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
              animation: 'blink 1s infinite',
              
            }}
          >
            Xem chi tiết
          </Button>
        </Box>
      </Card>
        <ChoosePopup
        title="Đăng Nhập Cần Thiết"
        message="Bạn cần đăng nhập để thực hiện chức năng này. Bạn có muốn chuyển đến trang đăng nhập không?"
        open={isPopupOpen}
        onclose={handlePopupClose}
        onAccept={handlePopupAccept}
        onReject={handlePopupClose}
      />
    </motion.div>
  );
};

export default TourCard;