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
  borderRadius: 30,
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 700,
  margin: "0 auto",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(8px)",
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
  },
  border: "2px solid transparent",
  "&:focus-within": {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  "& .MuiInputBase-input": {
    padding: "20px",
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(15),
    fontSize: "1.2rem",
    "&::placeholder": {
      color: alpha(theme.palette.text.primary, 0.6),
      opacity: 1,
    },
  },
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 8,
  padding: "12px 28px",
  borderRadius: 25,
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
  },
}));

const AnimatedIcon = styled(FlightTakeoffIcon)(({ theme }) => ({
  fontSize: 48,
  color: "#53A6D8",
  animation: `${float} 3s ease-in-out infinite`,
}));

const PopularDestination = styled(Chip)(({ theme }) => ({
  backgroundColor: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  color: "white",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    cursor: "pointer",
  },
}));

const GradientBackground = styled(Box)({
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  minHeight: "100vh",
  padding: "40px 0",
});

const QuickSearch = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

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
    <Container maxWidth="lg">
      <Box sx={{ textAlign: "center", mb: 8, mt: 4 }}>
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
            variant="h2"
            component="h1"
            fontWeight="bold"
            color="white"
            sx={{ ml: 2, textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
          >
            Khám Phá Điểm Đến Của Bạn
          </Typography>
        </Box>
        <Typography
          variant="h5"
          color="white"
          sx={{
            opacity: 0.9,
            maxWidth: 600,
            margin: "0 auto",
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          Hãy bắt đầu hành trình khám phá Việt Nam của bạn ngay hôm nay
        </Typography>
      </Box>

      <Fade in timeout={1000}>
        <form onSubmit={handleSearch}>
          <SearchPaper elevation={0}>
            <LocationOnIcon sx={{ ml: 3, color: "text.secondary" }} />
            <StyledInputBase
              placeholder="Bạn muốn đi đâu?"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              fullWidth
            />
            <SearchButton type="submit" aria-label="search">
              <SearchIcon />
              <Typography variant="button">Tìm</Typography>
            </SearchButton>
          </SearchPaper>
        </form>
      </Fade>

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography
          variant="h6"
          color="white"
          sx={{
            mb: 3,
            opacity: 0.9,
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          Khám phá hàng nghìn tour du lịch hấp dẫn trên khắp Việt Nam
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          flexWrap="wrap"
          sx={{ gap: 2 }}
        >
          {popularDestinations.map((destination) => (
            <PopularDestination
              key={destination}
              label={destination}
              onClick={() => setSearchText(destination)}
              variant="outlined"
            />
          ))}
        </Stack>
      </Box>
    </Container>
    // </GradientBackground>
  );
};

export default QuickSearch;
