import React, { useState } from 'react';
import './DepartureDates.css';
import Modal from '../modal/Modal';

const DepartureDates = ({ departures }) => {
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDateClick = (departure) => {
    if (new Date(departure.startDate) < new Date() || departure.availableSeats === 0) {
      return;
    }
    setSelectedDeparture(departure);
    setModalOpen(true);
  };

  const clearSelection = () => {
    setSelectedDeparture(null);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="departure-dates">
        {departures.map(departure => {
          const date = new Date(departure.startDate);
          const day = date.toLocaleDateString('vi-VN', { weekday: 'short' });
          const dayNumber = date.getDate();
          const month = date.getMonth() + 1;
          const formattedDate = `${dayNumber} thg ${month}`;
          const isExpired = date < new Date();
          const isFullyBooked = departure.availableSeats === 0;

          return (
            <div 
              key={departure.departureId} 
              className="departure-date-box" 
              onClick={() => handleDateClick(departure)}
            >
              {isExpired && <div className="expired-banner">Đã hết hạn</div>}
              {isFullyBooked && <div className="fully-booked-banner">Đã hết chỗ</div>}
              <div className="day">{day}</div>
              <div className="date">{formattedDate}</div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={clearSelection}>
        {selectedDeparture && (
          <>
            <h2>Chi tiết khởi hành</h2>
            <p>
              <strong>Ngày khởi hành:</strong> {new Date(selectedDeparture.startDate).toLocaleString('vi-VN')}
            </p>
            <p>
              <strong>Số chỗ còn:</strong> {selectedDeparture.availableSeats}
            </p>
            <p>
              <strong>Tổng số người tham gia:</strong> {selectedDeparture.maxParticipants}
            </p>
            <h3>Bảng giá:</h3>
            <ul>
              {selectedDeparture.tourPricing.map((pricing, index) => (
                <li key={index}>
                  {pricing.participantType}: {pricing.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </div>
  );
};

export default DepartureDates;