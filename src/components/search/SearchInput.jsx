import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  IconButton,
  Typography,
  Fade,
  useTheme,
  styled,
  alpha,
  TextField,
  Slider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  TravelExplore as TravelIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

// Styled components với kích thước nhỏ hơn
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  width: '250px',
  margin: '10px',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const SearchWrapper = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.2),
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiSelect-select': {
    paddingLeft: theme.spacing(1.5),
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.primary.main, 0.2),
    borderRadius: theme.shape.borderRadius * 2,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: '8px 12px',
    fontSize: '0.8rem',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.2),
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: '40px',
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
}));

const SearchInput = ({ onSearch }) => {
  const theme = useTheme();
  const [keyword, setKeyword] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [tourType, setTourType] = useState("");
  const [participantType, setParticipantType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [isHovered, setIsHovered] = useState(false);

  const handleSearch = () => {
    onSearch({ 
      keyword, 
      startLocation, 
      tourType, 
      participantType,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });
  };

  const provinces = [
    "Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  ];

  const tourTypes = {
    FAMILY: "Gia đình",
    GROUP: "Nhóm",
  };

  const participantTypes = {
    ADULTS: "Người lớn",
    CHILDREN: "Trẻ em",
    ELDERLY: "Người già",
  };

  // Hàm format giá tiền
  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Fade in timeout={1000}>
        <Box sx={{ position: 'relative', mt: 1, mb: 1 }}>
          <StyledPaper
            elevation={isHovered ? 8 : 3}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <TravelIcon
                sx={{
                  fontSize: 26,
                  color: theme.palette.primary.main,
                  mr: 1
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  fontSize: '0.95rem',
                }}
              >
                Khám phá chuyến đi
              </Typography>
            </Box>

            <SearchWrapper elevation={0}>
              <IconButton sx={{ p: '6px' }}>
                <SearchIcon color="primary" sx={{ fontSize: 18 }} />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: '0.85rem' }}
                placeholder="Tìm kiếm tour du lịch..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </SearchWrapper>

            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                <InputLabel sx={{ fontSize: '0.85rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ fontSize: 14 }} />
                    Địa điểm
                  </Box>
                </InputLabel>
                <StyledSelect
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  label="Địa điểm bắt đầu"
                  sx={{ '& .MuiSelect-select': { fontSize: '0.85rem' } }}
                >
                  <MenuItem value="" sx={{ fontSize: '0.85rem' }}>
                    <em>Chọn địa điểm</em>
                  </MenuItem>
                  {provinces.map((province) => (
                    <MenuItem key={province} value={province} sx={{ fontSize: '0.85rem' }}>
                      {province}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                <InputLabel sx={{ fontSize: '0.85rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon sx={{ fontSize: 14 }} />
                    Loại Tour
                  </Box>
                </InputLabel>
                <StyledSelect
                  value={tourType}
                  onChange={(e) => setTourType(e.target.value)}
                  label="Loại Tour"
                  sx={{ '& .MuiSelect-select': { fontSize: '0.85rem' } }}
                >
                  <MenuItem value="" sx={{ fontSize: '0.85rem' }}>
                    <em>Chọn loại tour</em>
                  </MenuItem>
                  {Object.entries(tourTypes).map(([key, value]) => (
                    <MenuItem key={key} value={key} sx={{ fontSize: '0.85rem' }}>
                      {value}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                <InputLabel sx={{ fontSize: '0.85rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 14 }} />
                    Loại Khách
                  </Box>
                </InputLabel>
                <StyledSelect
                  value={participantType}
                  onChange={(e) => setParticipantType(e.target.value)}
                  label="Loại Khách"
                  sx={{ '& .MuiSelect-select': { fontSize: '0.85rem' } }}
                >
                  <MenuItem value="" sx={{ fontSize: '0.85rem' }}>
                    <em>Chọn loại khách</em>
                  </MenuItem>
                  {Object.entries(participantTypes).map(([key, value]) => (
                    <MenuItem key={key} value={key} sx={{ fontSize: '0.85rem' }}>
                      {value}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Box>

            {/* Bộ lọc ngày - Compact Version */}
            <Box sx={{ mb: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 0.5,
                  fontSize: '0.85rem'
                }}
              >
                <CalendarIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />
                Ngày khởi hành
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <StyledDatePicker
                  label="Từ ngày"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      size: 'small',
                    }
                  }}
                />
                <StyledDatePicker
                  label="Đến ngày"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{
                    textField: {
                      variant: 'outlined', 
                      fullWidth: true,
                      size: 'small',
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Bộ lọc giá */}
            <Box sx={{ mb: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 0.5,
                  fontSize: '0.85rem'
                }}
              >
                <MoneyIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />
                Khoảng giá
              </Typography>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatPrice(value)}
                min={0}
                max={10000000}
                step={100000}
                size="small"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  {formatPrice(priceRange[0])}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  {formatPrice(priceRange[1])}
                </Typography>
              </Box>
            </Box>

            <StyledButton
              variant="contained"
              fullWidth
              onClick={handleSearch}
              startIcon={<SearchIcon sx={{ fontSize: 16 }} />}
            >
              Tìm kiếm
            </StyledButton>

            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                mt: 1,
                color: 'text.secondary',
                fontSize: '0.7rem',
              }}
            >
              Khám phá hàng nghìn tour du lịch hấp dẫn
            </Typography>
          </StyledPaper>
        </Box>
      </Fade>
    </LocalizationProvider>
  );
};

export default SearchInput;