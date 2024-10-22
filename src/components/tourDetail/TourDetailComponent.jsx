import React from 'react';
import './TourDetailComponent.css';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import SliderPaging from '../slider/SliderPaging';
import '../slider/sliderStyle.css';
const TourDetailComponent = ({ tourData }) => {
  const navigate = useNavigate();
  
  // Main image và thumbnail dimensions
  const mainImgDimension = {
    width: 750,
    height: 500
  };
  
  const thumbImgDimension = {
    width: 70,
    height: 70
  };

  // Calculate average rating
  const averageRating = tourData.reviews.reduce((acc, review) => acc + review.rating, 0) / tourData.reviews.length;

  // Get adult price from first departure
  const adultPrice = tourData.departures[0]?.tourPricing.find(
    price => price.participantType === "ADULTS"
  )?.price || 0;

  // Format price to VND currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Extract image URLs from tourData
  const imageUrls = tourData.images.map(img => img.imageUrl);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Slider Section */}
        <div className="md:w-1/2">
          <SliderPaging
            images={imageUrls}
            mainImgDimension={mainImgDimension}
            thumbImgDimension={thumbImgDimension}
          />
        </div>

        {/* Tour Information Section */}
        <div className="md:w-1/2">
          <div className="border rounded-lg shadow-lg p-6 h-full">
            <h1 className="text-3xl font-bold mb-4">{tourData.tourName}</h1>
            <p className="text-gray-600 mb-4">{tourData.tourDescription}</p>

            {/* Price Section */}
            <div className="mb-4">
              <s className="text-xl text-gray-500">{formatPrice(adultPrice * 1.2)}</s>
              <div className="text-2xl font-bold text-red-600">{formatPrice(adultPrice)}</div>
            </div>

            {/* Tour Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Thời gian:</span>
                <span>{tourData.duration} ngày</span>
              </div>

              {/* Rating Section */}
              <div className="flex items-center gap-2">
                <span className="font-semibold">Đánh giá:</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={index < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                      size={20}
                    />
                  ))}
                  <span className="ml-2">({tourData.reviews.length} đánh giá)</span>
                </div>
              </div>

              {/* Destinations Section */}
              <div>
                <h3 className="font-semibold mb-2">Lịch trình:</h3>
                <div className="space-y-2">
                  {tourData.destinations.map((dest, index) => (
                    <div key={dest.destinationId} className="flex items-center gap-2">
                      <span className="font-medium">{index + 1}.</span>
                      <span>{dest.name}, {dest.province}</span>
                      <span className="text-gray-500">({dest.duration} giờ)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departures Section */}
              <div>
                <h3 className="font-semibold mb-2">Lịch khởi hành sắp tới:</h3>
                <div className="space-y-2">
                  {tourData.departures.map(departure => (
                    <div key={departure.departureId} className="p-2 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {new Date(departure.startDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className={`${
                          departure.availableSeats <= 3 ? 'text-red-600' : 'text-green-600'
                        } font-medium`}>
                          Còn {departure.availableSeats}/{departure.maxParticipants} chỗ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Button */}
            <button
              onClick={() => navigate('/booking')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Đặt tour ngay
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Đánh giá từ khách hàng</h2>
        <div className="space-y-4">
          {tourData.reviews.map(review => (
            <div key={review.reviewId} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{review.userName}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={index < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                      size={16}
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(review.reviewDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourDetailComponent;