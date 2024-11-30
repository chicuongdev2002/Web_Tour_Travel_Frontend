import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Rating, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Chip, 
  Grid, 
  IconButton,
  Pagination,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Tooltip,
  Alert
} from "@mui/material";
import { 
  Star as StarIcon, 
  TrendingUp as TrendingUpIcon, 
  Search as SearchIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Verified as VerifiedIcon,
  FilterList as FilterListIcon
} from "@mui/icons-material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import nlp from "compromise";
import Sentiment from "sentiment";

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#7986cb',
      dark: '#303f9f'
    },
    background: {
      default: '#f4f6f9',
      paper: '#ffffff'
    },
    text: {
      primary: '#2c3e50',
      secondary: '#718096'
    }
  },
  typography: {
    fontFamily: [
      'Inter', 
      '-apple-system', 
      'BlinkMacSystemFont', 
      '"Segoe UI"', 
      'Roboto', 
      '"Helvetica Neue"', 
      'Arial', 
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    body1: {
      lineHeight: 1.6
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600
        }
      }
    }
  }
});

const RatingCircle = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  transform: 'scale(1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-label': {
    fontWeight: 500,
  },
}));

const ReviewComponent = ({ reviews, tourId }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("newest");
  const [positiveOnly, setPositiveOnly] = useState(false);
  const [filterTopic, setFilterTopic] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [reviewsPerPage, setReviewsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [mostFrequentKeywords, setMostFrequentKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [originalReviews, setOriginalReviews] = useState(reviews);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const ratingOptions = [
    { value: 0, label: "Tất cả" },
    { value: 5, label: "5 sao" },
    { value: 4, label: "4 sao" },
    { value: 3, label: "3 sao" },
    { value: 2, label: "2 sao" },
    { value: 1, label: "1 sao" },
  ];

  const topicOptions = [
    { value: "all", label: "Tất cả chủ đề" },
    { value: "trải nghiệm", label: "Trải nghiệm" },
    { value: "chất lượng", label: "Chất lượng dịch vụ" },
    { value: "hướng dẫn viên", label: "Hướng dẫn viên" },
  ];

  const getActiveFilters = () => {
    const filters = [];
    if (selectedKeyword) {
      filters.push({ label: `Từ khóa: ${selectedKeyword}`, key: 'keyword' });
    }
    if (keyword && keyword !== selectedKeyword) {
      filters.push({ label: `Tìm kiếm: ${keyword}`, key: 'search' });
    }
    if (sortOrder === "newest") {
      filters.push({ label: "Sắp xếp: Mới nhất", key: 'sort' });
    } else {
      filters.push({ label: "Sắp xếp: Cũ nhất", key: 'sort' });
    }
    if (filterRating > 0) {
      filters.push({ label: `Đánh giá: ${filterRating} sao`, key: 'rating' });
    }
    if (positiveOnly) {
      filters.push({ label: "Chỉ đánh giá tích cực", key: 'positive' });
    }
    if (filterTopic !== "all") {
      filters.push({ label: `Chủ đề: ${filterTopic}`, key: 'topic' });
    }
    return filters;
  };

 
  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
  ];


 

  const analyzeKeywords = (reviews) => {
    const keywordMap = new Map();
    const sentimentAnalyzer = new Sentiment();
    const stopWords = new Set([
      "rất", "của", "và", "là", "có", "được", "các", "những", "cho", "trong", 
      "đã", "với", "để", "này", "thì", "mà",
    ]);

    reviews.forEach((review) => {
      const normalizedComment = review.comment.toLowerCase().trim();
      const doc = nlp(normalizedComment);
      const phrases = [...new Set(doc.nouns().out("array"))];

      phrases.forEach((phrase) => {
        if (phrase.length > 2 && !stopWords.has(phrase) && isNaN(phrase)) {
          if (!keywordMap.has(phrase)) {
            keywordMap.set(phrase, {
              reviews: new Set(),
              sentiment: 0,
            });
          }
          const keywordData = keywordMap.get(phrase);
          keywordData.reviews.add(review.reviewId);
          keywordData.sentiment += sentimentAnalyzer.analyze(normalizedComment).score;
        }
      });
    });

    const sortedKeywords = Array.from(keywordMap.entries())
      .map(([word, data]) => ({
        text: word,
        count: data.reviews.size,
        sentiment: data.sentiment / data.reviews.size,
      }))
      .filter((keyword) => keyword.count > 1)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setMostFrequentKeywords(sortedKeywords);
  };

  useEffect(() => {
    if (originalReviews.length) {
      analyzeKeywords(originalReviews);
    }
  }, [originalReviews]);

  const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? "1 năm trước" : `${interval} năm trước`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? "1 tháng trước" : `${interval} tháng trước`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? "1 ngày trước" : `${interval} ngày trước`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? "1 giờ trước" : `${interval} giờ trước`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? "1 phút trước" : `${interval} phút trước`;
    return "Vừa xong";
  };

  const getRatingCategory = (averageRating) => {
    if (averageRating >= 4.5) return "Xuất sắc";
    if (averageRating >= 3.5) return "Tốt";
    if (averageRating >= 2.5) return "Trung bình";
    if (averageRating >= 1.5) return "Kém";
    return "Rất kém";
  };

  const filteredReviews = originalReviews
    .filter((review) => {
      const matchesRating = filterRating === 0 || review.rating === filterRating;
      const matchesPositive = !positiveOnly || review.rating >= 4;
      const matchesTopic = filterTopic === "all" || review.comment.toLowerCase().includes(filterTopic.toLowerCase());
      return matchesRating && matchesPositive && matchesTopic;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.reviewDate) - new Date(a.reviewDate);
      }
      return new Date(a.reviewDate) - new Date(b.reviewDate);
    });

  const averageRating = originalReviews.length > 0
    ? (originalReviews.reduce((sum, review) => sum + review.rating, 0) / originalReviews.length).toFixed(1)
    : 0;

  const reviewsToDisplay = keyword ? searchResults : filteredReviews;
  const ratingCategory = getRatingCategory(averageRating);
  const totalReviews = reviewsToDisplay.length;
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviewsToDisplay.slice(startIndex, startIndex + reviewsPerPage);
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  const resetFilters = () => {
    setFilterRating(0);
    setSortOrder("newest");
    setPositiveOnly(false);
    setFilterTopic("all");
    setKeyword("");
    setCurrentPage(1);
    setSelectedKeyword(null);
  };

  const handleKeywordClick = (keywordItem) => {
    if (selectedKeyword === keywordItem.text) {
      setSelectedKeyword(null);
      setKeyword("");
    } else {
      setKeyword(keywordItem.text);
      setSelectedKeyword(keywordItem.text);
    }
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const results = filteredReviews.filter((review) =>
      review.comment.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchResults(results);
    setCurrentPage(1);
    setShowSuggestion(true);
  };

  const filteredSuggestions = originalReviews
    .filter((review) =>
      review.comment.toLowerCase().includes(keyword.toLowerCase())
    )
    .map((review) => review.comment);


 const handleAddComment = async () => {
    if (!newComment) return;

    const newReview = {
        userId: user.userId, 
        tourId: tourId, 
        rating: newRating, 
        comment: newComment,
    };

    try {
        // Gọi API để thêm bình luận mới
        const response = await fetch('http://localhost:8080/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newReview),
        });

        if (!response.ok) {
            throw new Error('Failed to add comment');
        }

        const addedReview = await response.json();
        const reviewWithFullName = {
            ...addedReview,
            userName: user.fullName,
        };
        originalReviews.push(reviewWithFullName); 
        setNewComment("");
    } catch (error) {
        console.error('Error adding comment:', error);
    }
};
  const handleDeleteComment = async (reviewId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }
        
        // Cập nhật cả originalReviews và searchResults
        const updatedReviews = originalReviews.filter(review => review.reviewId !== reviewId);
        setOriginalReviews(updatedReviews);
        
        // Nếu đang có kết quả tìm kiếm, cập nhật luôn
        if (keyword) {
            const updatedSearchResults = searchResults.filter(review => review.reviewId !== reviewId);
            setSearchResults(updatedSearchResults);
        }
        
        // Reset về trang 1 nếu trang hiện tại không còn review nào
        const updatedTotalPages = Math.ceil(updatedReviews.length / reviewsPerPage);
        if (currentPage > updatedTotalPages) {
            setCurrentPage(1);
        }
        
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
};

 const handleEditComment = (reviewId) => {
    const reviewToEdit = originalReviews.find(review => review.reviewId === reviewId);
    setNewComment(reviewToEdit.comment);
    setEditRating(reviewToEdit.rating);
    setEditingReviewId(reviewId);
  };

  const handleUpdateComment = async () => {
    if (!newComment || !editingReviewId) return;

    const updatedReview = {
      reviewId: editingReviewId,
      userId: user.userId,
      tourId: tourId,
      rating: editRating,
      comment: newComment,
      reviewDate: new Date().toISOString()
    };

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${editingReviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReview),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const updatedReviewData = await response.json();
      const updatedReviews = originalReviews.map(review => 
        review.reviewId === editingReviewId 
          ? { ...updatedReviewData, userName: user.fullName }
          : review
      );
      setOriginalReviews(updatedReviews);
      setNewComment("");
      setEditingReviewId(null);
      setEditRating(5);
      
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };



  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Overview Section */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <RatingCircle>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {averageRating}
              </Typography>
              <Typography variant="subtitle2">
                {ratingCategory}
              </Typography>
            </RatingCircle>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                Tổng quan đánh giá
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating 
                  value={parseFloat(averageRating)} 
                  precision={0.5} 
                  readOnly 
                  size="large"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body1" color="text.secondary">
                  {`${originalReviews.length} đánh giá`}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(averageRating / 5) * 100} 
                color="primary"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Box>

          {/* Keywords Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUpIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6" color="primary">
                Từ khóa phổ biến
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {mostFrequentKeywords.map((keywordItem, index) => (
                <Tooltip 
                  key={index} 
                  title={`Xuất hiện trong ${keywordItem.count} đánh giá`}
                >
                  <FilterChip
                    icon={<StarIcon />}
                    label={keywordItem.text}
                    color={keywordItem.text === selectedKeyword ? "primary" : "default"}
                    onClick={() => handleKeywordClick(keywordItem)}
                    onDelete={
                      keywordItem.text === selectedKeyword 
                        ? () => {
                            setSelectedKeyword(null);
                            setKeyword("");
                          }
                        : undefined
                    }
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Filters Section */}
          <Box sx={{ mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ mb: 2 }}
            >
              {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </Button>

            {showFilters && (
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sắp xếp</InputLabel>
                    <Select
                      value={sortOrder}
                      label="Sắp xếp"
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <MenuItem value="newest">Mới nhất</MenuItem>
                      <MenuItem value="oldest">Cũ nhất</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Đánh giá</InputLabel>
                    <Select
                      value={filterRating}
                      label="Đánh giá"
                      onChange={(e) => setFilterRating(e.target.value)}
                    >
                      {ratingOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Chủ đề</InputLabel>
                    <Select
                      value={filterTopic}
                      label="Chủ đề"
                      onChange={(e) => setFilterTopic(e.target.value)}
                    >
                      {topicOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={positiveOnly}
                        onChange={() => setPositiveOnly(!positiveOnly)}
                        color="primary"
                      />
                    }
                    label="Chỉ đánh giá tích cực"
                  />
                </Grid>
              </Grid>
            )}

            {/* Search Box */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm trong đánh giá..."
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleSearch}
                sx={{ px: 4 }}
              >
                Tìm kiếm
              </Button>
            </Box>
          </Box>

          {/* Active Filters Display */}
          {getActiveFilters().length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Alert 
                severity="info" 
                sx={{ mb: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={resetFilters}>
                    Xóa tất cả
                  </Button>
                }
              >
                Bộ lọc đang áp dụng:
              </Alert>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {getActiveFilters().map((filter, index) => (
                  <FilterChip
                    key={`${filter.key}-${index}`}
                    label={filter.label}
                    onDelete={() => {
                      switch (filter.key) {
                        case 'keyword':
                          setSelectedKeyword(null);
                          setKeyword("");
                          break;
                        case 'search':
                          setKeyword("");
                          break;
                        case 'sort':
                          setSortOrder("newest");
                          break;
                        case 'rating':
                          setFilterRating(0);
                          break;
                        case 'positive':
                          setPositiveOnly(false);
                          break;
                        case 'topic':
                          setFilterTopic("all");
                          break;
                        default:
                          break;
                      }
                    }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Reviews List */}
          {currentReviews.map((review) => (
            <Box 
              key={review.reviewId} 
              sx={{ 
                p: 3, 
                mb: 3, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                borderLeft: '4px solid',
                borderLeftColor: 'primary.main',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 600 }}>
                    {review.userName}
                  </Typography>
                  <Tooltip title="Verified User">
                    <VerifiedIcon color="primary" sx={{ mr: 1 }} />
                  </Tooltip>
                  <Rating 
                    value={review.rating} 
                    readOnly 
                    precision={1}
                    size="small"
                  />
                </Box>
              <Typography variant="body2" color="text.secondary">
                  {timeAgo(review.reviewDate)}
                </Typography>
                {review.userId === user?.userId && (
                  <Box sx={{ ml: 2 }}>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditComment(review.reviewId)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteComment(review.reviewId)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
              <Typography variant="body1" color="text.primary">
                {review.comment}
              </Typography>
            </Box>
          ))}

          {/* Empty State */}
          {currentReviews.length === 0 && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                bgcolor: 'background.paper',
                borderRadius: 2,
                mb: 4
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Không tìm thấy đánh giá nào
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={resetFilters}
                sx={{ mt: 2 }}
              >
                Xóa tất cả bộ lọc
              </Button>
            </Box>
          )}

          {/* Pagination */}
          {currentReviews.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              mb: 4,
              '& .MuiPagination-root': {
                '& .Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }
            }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
                color="primary"
                variant="outlined"
                shape="rounded"
                size="large"
              />
            </Box>
          )}

          {/* Add New Review Section */}
         <Box 
        sx={{ 
          mt: 4,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          {editingReviewId ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}
        </Typography>
        <Rating
          name="new-rating"
          value={editingReviewId ? editRating : newRating}
          onChange={(event, newValue) => {
            editingReviewId ? setEditRating(newValue) : setNewRating(newValue);
          }}
          size="large"
          precision={1}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết đánh giá của bạn..."
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={editingReviewId ? handleUpdateComment : handleAddComment}
            startIcon={editingReviewId ? <EditIcon /> : <StarIcon />}
            disabled={!newComment.trim()}
          >
            {editingReviewId ? 'Cập nhật đánh giá' : 'Đăng đánh giá'}
          </Button>
          {editingReviewId && (
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => {
                setEditingReviewId(null);
                setNewComment("");
                setEditRating(5);
              }}
            >
              Hủy
            </Button>
          )}
        </Box>
      </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ReviewComponent;