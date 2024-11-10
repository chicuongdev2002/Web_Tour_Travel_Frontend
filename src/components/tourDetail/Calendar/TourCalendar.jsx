import React, { useState } from "react";
import Calendar from "react-calendar";
import Modal from "../modal/Modal";
import "react-calendar/dist/Calendar.css";
import "./TourCalendar.css";

const TourCalendar = ({ departures, onDateSelect }) => {
  const [value, setValue] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateChange = (date) => {
    setValue(date);
    console.log(departures);

    const selectedDeparture = departures.find(
      (d) => new Date(d.startDate).toDateString() === date.toDateString(),
    );
    if (selectedDeparture) {
      onDateSelect(selectedDeparture);
    }
    setIsModalOpen(false);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const departure = departures.find(
        (d) => new Date(d.startDate).toDateString() === date.toDateString(),
      );
      // Kiểm tra xem ngày có phải là ngày hiện tại không
      const isToday = date.toDateString() === new Date().toDateString();

      return isToday
        ? "highlight-today"
        : departure
          ? "highlight-1"
          : "normal-day-1";
    }
    return null;
  };

  const formatPrice = (price) => {
    return (price / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const departure = departures.find(
        (d) => new Date(d.startDate).toDateString() === date.toDateString(),
      );
      if (departure) {
        const childrenPricing = departure.tourPricing.find(
          (p) => p.participantType === "CHILDREN",
        );
        return childrenPricing ? (
          <div className="tile-content-1">
            <span>{formatPrice(childrenPricing.price)}</span>
          </div>
        ) : null;
      }
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <button className="calendar-button" onClick={() => setIsModalOpen(true)}>
        <div className="view-calendar">
          <span>📅</span>
          <span>Xem lịch</span>
        </div>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="calendar-modal-content">
          <h2>Chọn ngày</h2>
          <div className="calendar-wrapper">
            <Calendar
              onChange={handleDateChange}
              value={value}
              tileClassName={tileClassName}
              tileContent={tileContent}
              nextLabel={null}
              prevLabel={null}
              view="month"
              maxDetail="month"
              minDetail="month"
            />
            <Calendar
              onChange={handleDateChange}
              value={value}
              tileClassName={tileClassName}
              tileContent={tileContent}
              nextLabel={null}
              prevLabel={null}
              view="month"
              maxDetail="month"
              minDetail="month"
              defaultActiveStartDate={
                new Date(value.getFullYear(), value.getMonth() + 1, 1)
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TourCalendar;
