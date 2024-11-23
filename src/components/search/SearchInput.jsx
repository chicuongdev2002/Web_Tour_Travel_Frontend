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
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  TravelExplore as TravelIcon,
} from '@mui/icons-material';

// Styled components với kích thước nhỏ hơn
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2), // Giảm padding từ 4 xuống 2
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  width: '250px', // Giảm width từ 400px xuống 300px
  margin: '10px', // Giảm margin từ 20px xuống 10px
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
  marginBottom: theme.spacing(1.5), // Giảm margin bottom
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  marginBottom: theme.spacing(1.5), // Giảm margin bottom
  '& .MuiSelect-select': {
    paddingLeft: theme.spacing(1.5),
    paddingTop: '8px', // Giảm padding
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

const StyledButton = styled(Button)(({ theme }) => ({
  height: '45px', // Giảm chiều cao button
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  fontSize: '0.9rem', // Giảm font size
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
  const [isHovered, setIsHovered] = useState(false);

  const handleSearch = () => {
    onSearch({ keyword, startLocation, tourType, participantType });
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

  return (
    <Fade in timeout={1000}>
      <Box sx={{ position: 'relative', mt: 2, mb: 2 }}> {/* Giảm margin top/bottom */}
        <StyledPaper
          elevation={isHovered ? 8 : 3}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> {/* Giảm margin bottom */}
            <TravelIcon
              sx={{
                fontSize: 30, // Giảm kích thước icon
                color: theme.palette.primary.main,
                mr: 1.5
              }}
            />
            <Typography
              variant="h6" // Thay đổi từ h5 xuống h6
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                fontSize: '1rem', // Giảm font size
              }}
            >
              Khám phá chuyến đi của bạn
            </Typography>
          </Box>

          <SearchWrapper elevation={0}>
            <IconButton sx={{ p: '8px' }}> {/* Giảm padding */}
              <SearchIcon color="primary" sx={{ fontSize: 20 }} /> {/* Giảm kích thước icon */}
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }} // Giảm font size
              placeholder="Tìm kiếm tour du lịch..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </SearchWrapper>

          <FormControl fullWidth size="small"> {/* Thêm size="small" */}
            <InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ fontSize: 16 }} />
                Địa điểm bắt đầu
              </Box>
            </InputLabel>
            <StyledSelect
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              label="Địa điểm bắt đầu"
            >
              <MenuItem value="">
                <em>Chọn địa điểm</em>
              </MenuItem>
              {provinces.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon sx={{ fontSize: 16 }} />
                Loại Tour
              </Box>
            </InputLabel>
            <StyledSelect
              value={tourType}
              onChange={(e) => setTourType(e.target.value)}
              label="Loại Tour"
            >
              <MenuItem value="">
                <em>Chọn loại tour</em>
              </MenuItem>
              {Object.entries(tourTypes).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ fontSize: 16 }} />
                Loại Khách
              </Box>
            </InputLabel>
            <StyledSelect
              value={participantType}
              onChange={(e) => setParticipantType(e.target.value)}
              label="Loại Khách"
            >
              <MenuItem value="">
                <em>Chọn loại khách</em>
              </MenuItem>
              {Object.entries(participantTypes).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>

          <StyledButton
            variant="contained"
            fullWidth
            onClick={handleSearch}
            startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
          >
            Tìm kiếm
          </StyledButton>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              mt: 2, // Giảm margin top
              color: 'text.secondary',
              fontSize: '0.75rem', // Giảm font size
            }}
          >
            Khám phá hàng nghìn tour du lịch hấp dẫn trên khắp Việt Nam
          </Typography>
        </StyledPaper>
      </Box>
    </Fade>
  );
};

export default SearchInput;