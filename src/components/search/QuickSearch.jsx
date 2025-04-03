import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Typography,
  Fade,
  Container,
  Chip,
  Stack,
  styled,
  alpha,
  keyframes,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  FlightTakeoff as FlightTakeoffIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";

// Keyframes for animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${alpha("#1976d2", 0.7)};
  }
  70% {
    box-shadow: 0 0 0 10px ${alpha("#1976d2", 0)};
  }
  100% {
    box-shadow: 0 0 0 0 ${alpha("#1976d2", 0)};
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Custom styled components
const SearchPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  borderRadius: 20, // Giảm borderRadius
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: theme.breakpoints.values.sm, // Giới hạn chiều rộng tối đa
  margin: "0 auto",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Giảm boxShadow
  backdropFilter: "blur(5px)",
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  border: "2px solid transparent",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
  },
  "&:focus-within": {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: "95%", // Điều chỉnh chiều rộng cho mobile
    borderRadius: 15,
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  "& .MuiInputBase-input": {
    padding: "2px", // Giảm padding
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(10),
    fontSize: "1rem", // Giảm kích thước font
    "&::placeholder": {
      color: alpha(theme.palette.text.primary, 0.6),
      opacity: 1,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: "0.9rem", // Nhỏ hơn nữa trên mobile
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(8),
    },
  },
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 4, // Giảm khoảng cách
  padding: "8px 20px", // Giảm padding
  borderRadius: 20,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  animation: `${pulse} 2s infinite`,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.05)",
  },
  "& .MuiTypography-root": {
    marginLeft: theme.spacing(1),
    fontWeight: 600,
    fontSize: "0.8rem", // Giảm kích thước font
  },
  [theme.breakpoints.down('sm')]: {
    padding: "6px 15px", // Nhỏ hơn trên mobile
  },
}));

const AnimatedIcon = styled(FlightTakeoffIcon)(({ theme }) => ({
  fontSize: 36, // Giảm kích thước icon
  color: "#53A6D8",
  animation: `${float} 3s ease-in-out infinite`,
  [theme.breakpoints.down('sm')]: {
    fontSize: 28, // Nhỏ hơn trên mobile
  },
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  minHeight: "100vh",
  padding: "40px 0",
  [theme.breakpoints.down('sm')]: {
    padding: "20px 0", // Giảm padding trên mobile
  },
}));

const QuickSearch = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const popularDestinations = [
    "Hạ Long",
    "Đà Nẵng", 
    "Phú Quốc",
    "Nha Trang",
    "Sapa",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate("/search-page", {
        state: { keyword: searchText },
      });
    }
  };

  return (
    // <GradientBackground>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: isMobile ? 4 : 8, mt: isMobile ? 2 : 4 }}>
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <AnimatedIcon />
              <Typography
                variant={isMobile ? "h4" : "h2"}
                component="h1"
                fontWeight="bold"
                color="white"
                sx={{ 
                  ml: 2, 
                  textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                  fontSize: isMobile ? "1.5rem" : undefined
                }}
              >
                Khám Phá Điểm Đến Của Bạn
              </Typography>
            </Box>
          )}

          <Typography
            variant={isMobile ? "subtitle1" : "h5"}
            color="white"
            sx={{
              opacity: 0.9,
              maxWidth: 600,
              margin: "0 auto",
              mb: 3,
              textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              fontSize: isMobile ? "0.9rem" : undefined,
            }}
          >
            Hãy bắt đầu hành trình khám phá Việt Nam của bạn ngay hôm nay
          </Typography>

          <Fade in timeout={1000}>
            <form onSubmit={handleSearch}>
              <SearchPaper elevation={0}>
                <LocationOnIcon sx={{ ml: 2, color: "text.secondary", fontSize: "small" }} />
                <StyledInputBase
                  placeholder="Bạn muốn đi đâu?"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  fullWidth
                />
                <SearchButton type="submit" aria-label="search">
                  <SearchIcon fontSize="small" />
                  {!isMobile && <Typography variant="button">Tìm</Typography>}
                </SearchButton>
              </SearchPaper>
            </form>
          </Fade>

          {popularDestinations.length > 0 && (
            <Box sx={{ mt: isMobile ? 2 : 6, textAlign: "center" }}>
              <Typography
                variant={isMobile ? "subtitle2" : "h6"}
                color="white"
                sx={{
                  mb: 2,
                  opacity: 0.9,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                  fontSize: isMobile ? "0.8rem" : undefined,
                }}
              >
                Khám phá hàng nghìn tour du lịch hấp dẫn trên khắp Việt Nam
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                flexWrap="wrap"
                sx={{ 
                  gap: 1, 
                  maxWidth: "100%",
                  overflow: "auto",
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                {popularDestinations.map((destination) => (
                  <Chip
                    key={destination}
                    label={destination}
                    onClick={() => setSearchText(destination)}
                    size={isMobile ? "small" : "medium"}
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "rgba(255,255,255,0.5)",
                      '&:hover': {
                        backgroundColor: "rgba(255,255,255,0.1)"
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Container>
    // </GradientBackground>
  );
};

export default QuickSearch;