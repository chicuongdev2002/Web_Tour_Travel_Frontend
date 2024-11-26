import React, { useState } from "react";
import "./TourDetailComponent.css";
import { useNavigate } from "react-router-dom";
import { Star, ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import SliderPaging from "../slider/SliderPaging";
import "../slider/sliderStyle.css";
// import Calendar from 'react-calendar';
import TourCalendar from "./Calendar/TourCalendar";
import DepartureDates from "./Calendar/DepartureDates";
import ItineraryDetail from "./InfomaitionTour/ItineraryDetail";
import TourMap from "./map/TourMap";
import ReviewComponent from "./review/ReviewComponent";
import ChoosePopup from '../popupNotifications/ChoosePopup';
import { UPDATE_TOUR_STATUS } from '../../config/host';
import { deleteData } from '../../functions/deleteData';
import CustomPop from '../popupNotifications/CustomPop';
import imageBasic from '../../assets/404.png';
const TourDetailComponent = ({ tourData }) => {
  const storedUser = sessionStorage.getItem("user");
  const navigate = useNavigate();
  const [selectedDeparture, setSelectedDeparture] = useState(
    tourData.departures[0],
  );
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [openPopup, setOpenPopup] = useState(-1);

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev);
  };
  const mainImgDimension = {
    width: 750,
    height: 500,
  };

  const thumbImgDimension = {
    width: 70,
    height: 70,
  };
  console.log("tourData", tourData);
  const averageRating =
    tourData.reviews.reduce((acc, review) => acc + review.rating, 0) /
    tourData.reviews.length;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const handleDateSelect = (departure) => {
    console.log("Selected departure:", departure);
  };

  const imageUrls = tourData.images.map((img) => img.imageUrl);

  const participantTypeTranslation = {
    ADULTS: "Người lớn",
    CHILDREN: "Trẻ em",
    ELDERLY: "Người cao tuổi",
  };

  const goToBooking = () => {
    if(!storedUser)
      navigate('/login-register', { state: tourData });
    else 
      navigate('/booking', { state: tourData });
  }

  const goToUpdateTour = () => {
    navigate(`/update-tour/${tourData.tourId}`, { state: tourData });
  }

  const deleteTour = async () => {
    const result = await deleteData(UPDATE_TOUR_STATUS, tourData.tourId);
    if (result)
      setOpenPopup(1);
    else
      setOpenPopup(0);
  }
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Slider Section */}
        <div className="md:w-1/2">
          <SliderPaging
            images={imageUrls.length ? imageUrls : [imageBasic]}
            mainImgDimension={mainImgDimension}
            thumbImgDimension={thumbImgDimension}
          />

          {/* Tour Description Section */}
          <div className="description-section">
            <h3 className="font-semibold mb-2">Bạn sẽ trải nghiệm</h3>
            <p className="description-text">
              {isDescriptionExpanded
                ? tourData.tourDescription
                : `${tourData.tourDescription.substring(0, 100)}...`}
            </p>
            <button
              onClick={toggleDescription}
              className="text-blue-600 hover:underline mt-2"
            >
              {isDescriptionExpanded ? "Xem ít hơn" : "Xem thêm"}
            </button>
          </div>

          {/* Tour Map Section */}
          <div className="description-section">
            <h3 className="font-semibold mb-2">Bản đồ lộ trình</h3>
            <TourMap destinations={tourData.destinations} />
          </div>
        </div>

        {/* Tour Information Section */}
        <div className="md:w-1/2">
          <div className="border rounded-lg shadow-lg p-6 h-full">
            <div className='divRowBetween'>
              <h1 className="text-3xl font-bold mb-4 tour-name text-center">
                {tourData.tourName}
              </h1>
              { storedUser && JSON.parse(storedUser).role === "ADMIN" && 
                <div>
                  <button onClick={goToUpdateTour}>Sửa</button>
                  <button onClick={() => setOpenPopup(-2)}>Xóa</button>
                </div>
              }
            </div>

            {/* Price Section */}
            <div className="mb-4">
              <h3 className="font-semibold text-center">Giá</h3>
              <div className="space-y-2 text-center">
                {selectedDeparture?.tourPricing.map((price) => {
                  const translatedType =
                    participantTypeTranslation[price.participantType] ||
                    price.participantType;

                  return (
                    <div
                      key={price.participantType}
                      className="flex justify-center"
                    >
                      <span>{translatedType}:</span>
                      <span className="font-bold text-red-600 ml-2">
                        {formatPrice(price.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tour Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 justify-center">
                <span className="font-semibold">Thời gian</span>
                <span>{tourData.duration} ngày</span>
              </div>

              {/* Rating Section */}
              <div className="flex items-center gap-2 justify-center">
                <span className="font-semibold">Đánh giá</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={
                        index < Math.round(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                      size={20}
                    />
                  ))}
                  <span className="ml-2">
                    ({tourData.reviews.length} đánh giá)
                  </span>
                </div>
              </div>

              {/* Destinations Section */}
              <div>
                <h3 className="font-semibold mb-2">Lịch trình</h3>
                <div className="space-y-2">
                  {tourData.destinations.map((dest, index) => (
                    <div
                      key={dest.destinationId}
                      className="flex items-center gap-2"
                    >
                      <span className="font-medium">{index + 1}.</span>
                      <span>
                        {dest.name}, {dest.province}
                      </span>
                      <span className="text-gray-500">
                        ({dest.duration} giờ)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departure Dates Section */}
              <div>
                <h3 className="font-semibold mb-2">Có vé trống cho bạn</h3>
                <div className="flex-container">
                  <TourCalendar
                    departures={tourData.departures}
                    onDateSelect={handleDateSelect}
                  />
                  <DepartureDates
                    departures={tourData.departures}
                    onDateSelect={handleDateSelect}
                  />
                </div>
              </div>
            </div>

            {/* Booking Button */}
            <button onClick={goToBooking} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Đặt tour ngay
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Lịch trình chi tiết</h2>
        <ItineraryDetail destinations={tourData.destinations} />
      </div>

      {/* Reviews Section */}
      <div className="w-full max-w-7xl mx-auto p-4">
        <ReviewComponent reviews={tourData.reviews} />
      </div>
      <ChoosePopup title="Xoá tour" message="Bạn có chắc chắn muốn xóa tour này không?" open={openPopup == -2} onclose={() => setOpenPopup(-1)}
        onAccept={() => { deleteTour(); setOpenPopup(1) }} onReject={() => setOpenPopup(-1)} />
      <CustomPop onSuccess={() => { navigate('/tour-list'); setOpenPopup(-1) }} onFail={() => setOpenPopup(-1)} notify={openPopup} messageSuccess="Xoá tour thành công" />
    </div>
  );
};

export default TourDetailComponent;
