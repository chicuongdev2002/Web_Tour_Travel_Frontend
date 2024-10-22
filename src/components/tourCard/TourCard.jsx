import React from 'react';
import './TourCard.css';
import { FaMapMarkedAlt } from "react-icons/fa";
import { PiCalendarDotsFill, PiClockCountdownFill, PiChairBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
const TourCard = ({ tour }) => {
    const navigate = useNavigate(); 

    const handleViewDetail = () => {
        navigate(`/tour-details/${tour.tourId}`); 
    };
  return (
      <div className="tour-card">
        <img src={tour.image} alt={tour.title} className="tour-image" />
        <div className="tour-details">
          <h3 className="tour-title">{tour.title}</h3>
          <p className="tour-description">{tour.description}</p>
          <div className="tour-info">
            <div className='divRow mb-1 align-items-center'>
              <FaMapMarkedAlt size={30} />
              <p className='textInfo'>{tour.departureCity}</p>
            </div>
            <div className='divRow mb-1 align-items-center'>
              <PiCalendarDotsFill size={30} />
              <p className='textInfo'>{tour.startDate}</p>
            </div>
            {/* <div className='divRow mb-1 justify-content-between' style={{ alignItems: 'center' }}> */}
              <div className='divRow align-items-center'>
                <PiClockCountdownFill size={30} />
                <p className='textInfo'>{tour.duration}</p>
              </div>
              <div className='divRow align-items-center'>
                <PiChairBold size={30} />
                <p className='textInfo'>Số chỗ trống:{tour.availableSeats}</p>
              {/* </div> */}
            </div>
          </div>
          <div className="tour-pricing">
            <p className="original-price">{tour.originalPrice} đ</p>
            <p className="discounted-price">{tour.discountedPrice} đ</p>
          </div>
           <button className="book-now" onClick={handleViewDetail}>Xem chi tiết</button>
        </div>
        {/* <div className="countdown">{tour.countdown}</div> */}
      </div>
  );
};

export default TourCard;
