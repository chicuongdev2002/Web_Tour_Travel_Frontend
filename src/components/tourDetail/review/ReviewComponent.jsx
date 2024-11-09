import React, { useState, useEffect } from 'react';
import './ReviewComponent.css';
import { Star, TrendingUp, X,Search } from 'lucide-react';
import nlp from 'compromise';
import Sentiment from 'sentiment';
import Select from 'react-select';
const ReviewComponent = ({ reviews }) => {
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('newest');
  const [positiveOnly, setPositiveOnly] = useState(false);
  const [filterTopic, setFilterTopic] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [reviewsPerPage, setReviewsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [mostFrequentKeywords, setMostFrequentKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [originalReviews] = useState(reviews);
  const [showSuggestion, setShowSuggestion] = useState(false); // State for suggestions
 // Tạo các tùy chọn cho select
const ratingOptions = [
  { value: 0, label: 'Tất cả' },
  { value: 5, label: '5' },
  { value: 4, label: '4' },
  { value: 3, label: '3' },
  { value: 2, label: '2' },
  { value: 1, label: '1' },
];
  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
  ];

  const topicOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'trải nghiệm', label: 'Trải nghiệm' },
    { value: 'chất lượng', label: 'Chất lượng dịch vụ' },
    { value: 'hướng dẫn viên', label: 'Hướng dẫn viên' },
  ];
  const getActiveFilters = () => {
    const filters = [];
    
    if (selectedKeyword) {
      filters.push(`đang tìm kiếm với từ khóa "${selectedKeyword}"`);
    }
    
    if (keyword && keyword !== selectedKeyword) {
      filters.push(`đang tìm kiếm với từ khóa nhập vào "${keyword}"`);
    }

    if (sortOrder === 'newest') {
      filters.push('sắp xếp theo mới nhất');
    } else {
      filters.push('sắp xếp theo cũ nhất');
    }

    if (filterRating > 0) {
      filters.push(`đang lọc theo đánh giá ${filterRating} sao`);
    }

    if (positiveOnly) {
      filters.push('chỉ hiển thị đánh giá tích cực');
    }

    if (filterTopic !== 'all') {
      filters.push(`đang lọc theo chủ đề "${filterTopic}"`);
    }

    return filters;
  };

  const analyzeKeywords = (reviews) => {
    const keywordMap = new Map();
    const sentimentAnalyzer = new Sentiment();
    const stopWords = new Set(['rất', 'của', 'và', 'là', 'có', 'được', 'các', 'những', 'cho', 'trong', 'đã', 'với', 'để', 'này', 'thì', 'mà']);

    reviews.forEach(review => {
      const normalizedComment = review.comment.toLowerCase().trim();
      const doc = nlp(normalizedComment);
      const phrases = [...new Set(doc.nouns().out('array'))];

      phrases.forEach(phrase => {
        if (phrase.length > 2 && !stopWords.has(phrase) && isNaN(phrase)) {
          if (!keywordMap.has(phrase)) {
            keywordMap.set(phrase, {
              reviews: new Set(),
              sentiment: 0
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
        sentiment: data.sentiment / data.reviews.size
      }))
      .filter(keyword => keyword.count > 1)
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

  const filteredReviews = originalReviews.filter(review => {
    const matchesRating = filterRating === 0 || review.rating === filterRating;
    const matchesPositive = !positiveOnly || review.rating >= 4;
    const matchesTopic = filterTopic === 'all' || 
      review.comment.toLowerCase().includes(filterTopic.toLowerCase());

    return matchesRating && matchesPositive && matchesTopic;
  }).sort((a, b) => {
    if (sortOrder === 'newest') {
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
    setSortOrder('newest');
    setPositiveOnly(false);
    setFilterTopic('all');
    setKeyword('');
    setCurrentPage(1);
    setSelectedKeyword(null);
  };

  const handleKeywordClick = (keywordItem) => {
    if (selectedKeyword === keywordItem.text) {
      setSelectedKeyword(null);
      setKeyword('');
    } else {
      setKeyword(keywordItem.text);
      setSelectedKeyword(keywordItem.text);
    }
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const results = filteredReviews.filter(review => 
      review.comment.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchResults(results);
    setCurrentPage(1); 
    setShowSuggestion(true)
  };

  const filteredSuggestions = originalReviews
    .filter(review => review.comment.toLowerCase().includes(keyword.toLowerCase()))
    .map(review => review.comment);

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion);
    handleSearch();
    setShowSuggestion(false); 
  };

  return (
    <div className="review-container">
      <h2 className="review-title">Đánh giá từ khách hàng</h2>

      <div className="rating-summary">
        <div className="rating-circle">{averageRating}</div>
        <div className="rating-text">{ratingCategory}</div>
        <div className="rating-details">{`Từ ${originalReviews.length} đánh giá`}</div>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-700">Từ khóa phổ biến</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {mostFrequentKeywords.length > 0 ? (
            mostFrequentKeywords.map((keywordItem, index) => (
              <button
                key={index}
                onClick={() => handleKeywordClick(keywordItem)}
                className={`
                  relative px-4 py-2 rounded-md border
                  ${keywordItem.text === selectedKeyword 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
                  transition-all duration-200 flex items-center gap-2
                `}
              >
                <span className="font-medium text-blue">{keywordItem.text}</span>
                {keywordItem.text === selectedKeyword && (
                  <X className="w-4 h-4 text-blue-500" />
                )}
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-gray-500">Không có từ khóa phổ biến nào.</p>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={resetFilters}>
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="filter-container">
        <div className="mr-4">
          <label className="mr-2">Sắp xếp theo:</label>
           <Select
            options={sortOptions}
            onChange={(selectedOption) => setSortOrder(selectedOption.value)}
            value={sortOptions.find(option => option.value === sortOrder)}
          />
        </div>

        <div className="mr-4">
          <label className="mr-2">Đánh giá:</label>
          <Select
  options={ratingOptions}
  onChange={(selectedOption) => setFilterRating(selectedOption.value)}
  value={ratingOptions.find(option => option.value === filterRating)}
  styles={{
    control: (provided) => ({
      ...provided,
      borderColor: '#2f6bbf',
      '&:hover': {
        borderColor: '#007bff',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 100,
    }),
  }}
/>
        </div>

        <div className="mr-4">
          <label className="mr-2">Chủ đề:</label>
           <Select
            options={topicOptions}
            onChange={(selectedOption) => setFilterTopic(selectedOption.value)}
            value={topicOptions.find(option => option.value === filterTopic)}
          />
        </div>
        <div className="mr-4">
          <label className="mr-2">Đánh giá/Trang</label>
              <Select
            options={[
              { value: 5, label: '5' },
              { value: 10, label: '10' },
              { value: 20, label: '20' },
            ]}
            onChange={(selectedOption) => {
              setReviewsPerPage(selectedOption.value);
              setCurrentPage(1);
            }}
            value={[5, 10, 20].map(value => ({ value, label: String(value) })).find(option => option.value === reviewsPerPage)}
          />
        </div>
         <div className="positive-review-container">
         <label htmlFor="positive-only" className="positive-review-label">
    Chỉ hiển thị đánh giá tích cực
  </label>
  <input
    type="checkbox"
    id="positive-only"
    checked={positiveOnly}
    onChange={() => setPositiveOnly(!positiveOnly)}
    className="positive-review-checkbox" 
  />
</div>
       <div className="search-container">
  <div className="search-input-container">
      <label className="mr-2">Nếu bạn chưa tìm thấy bình luận theo ý hãy </label>
    <input
      type="text"
      className="search-input"
      value={keyword}
      onChange={(e) => {
        setKeyword(e.target.value);
        setShowSuggestion(true);
      }}
      placeholder="Nhập từ khóa"
    />
    <button onClick={handleSearch} className="search-button">
      <Search className="search-icon" />
      Tìm kiếm
    </button>
    {showSuggestion && keyword && filteredSuggestions.length > 0 && (
      <ul className="suggestions-list">
        {filteredSuggestions.map((suggestion, index) => (
          <li
            key={index}
            className="suggestion-item"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
      </div>
      
      <div className="filter-status-container mb-4">
        <div className="filter-status text-sm text-gray-600">
          {getActiveFilters().map((filter, index) => (
            <span key={index} className="filter-badge">
              {filter}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {currentReviews.length === 0 ? (
          <div>
            Không có đánh giá phù hợp.
            <button className="reset-button" onClick={resetFilters}>
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          currentReviews.map(review => (
            <div key={review.reviewId} className={`review-card ${keyword ? 'search-result' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="review-user">{review.userName}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={index < review.rating ? "text-yellow-400" : "text-gray-300"}
                      size={16}
                    />
                  ))}
                </div>
                <span className="review-date">
                  {timeAgo(review.reviewDate)}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <span>{`Hiện tại: ${currentPage}/${totalPages} trang`}</span>
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index} 
            onClick={() => setCurrentPage(index + 1)} 
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewComponent;