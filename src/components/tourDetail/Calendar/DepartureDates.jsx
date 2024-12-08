import React, { useState } from "react";
import "./DepartureDates.css";
import Modal from "../modal/Modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Check } from "lucide-react";

const DepartureDates = ({ departures, onDateSelect }) => {
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDateClick = (departure) => {
    if (
      new Date(departure.startDate) < new Date() ||
      departure.availableSeats === 0
    ) {
      return;
    }
    setSelectedDeparture(departure);
    setModalOpen(true);
  };

  const clearSelection = () => {
    setSelectedDeparture(null);
    setModalOpen(false);
  };

  const handleDepartureSelect = (departure) => {
    // Trigger the onDateSelect prop to update parent component's state
    onDateSelect && onDateSelect(departure);

    // Close the modal
    clearSelection();
  };

  const translateParticipantType = (type) => {
    switch (type) {
      case "CHILDREN":
        return "Trẻ em (dưới 140 cm)";
      case "ELDERLY":
        return "Người cao tuổi";
      case "ADULTS":
        return "Người lớn";
      default:
        return type;
    }
  };

  // Helper function để chuẩn hóa ngày về đầu ngày (00:00:00)
  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // Format tên tháng theo tiếng Việt
  const formatShortWeekday = (locale, date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };

  const formatMonthYear = (locale, date) => {
    return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div>
      <div className="departure-dates grid grid-cols-3 gap-2">
        {departures.map((departure) => {
          const date = new Date(departure.startDate);
          const day = date.toLocaleDateString("vi-VN", { weekday: "short" });
          const dayNumber = date.getDate();
          const month = date.getMonth() + 1;
          const formattedDate = `${dayNumber} thg ${month}`;
          const isExpired = date < new Date();
          const isFullyBooked = departure.availableSeats === 0;

          return (
            <div
              key={departure.departureId}
              className="relative departure-date-box"
            >
              <div
                className="cursor-pointer"
                onClick={() => handleDateClick(departure)}
              >
                {isExpired && <div className="expired-banner">Đã hết hạn</div>}
                {isFullyBooked && (
                  <div className="fully-booked-banner">Đã hết chỗ</div>
                )}
                <div className="day">{day}</div>
                <div className="date">{formattedDate}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={clearSelection}>
        {selectedDeparture && (
          <div className={`modal-content ${isModalOpen ? "show" : ""}`}>
            <h2>Chi tiết khởi hành</h2>
            <div className="calendar-wide-container">
              <div className="react-calendar-wrapper">
                <Calendar
                  value={new Date(selectedDeparture.startDate)} // Focus on the start date month
                  minDate={new Date()} // Prevent selection of past dates
                  maxDate={new Date(selectedDeparture.endDate)} // Limit to end date
                  showDoubleView={false} // Show only one month
                  formatShortWeekday={formatShortWeekday}
                  formatMonthYear={formatMonthYear}
                  showNeighboringMonth={true}
                  prev2Label={null}
                  next2Label={null}
                  tileClassName={({ date }) => {
                    const today = normalizeDate(new Date());
                    const currentDate = normalizeDate(date);
                    const startDate = normalizeDate(
                      new Date(selectedDeparture.startDate),
                    );
                    const endDate = normalizeDate(
                      new Date(selectedDeparture.endDate),
                    );

                    const isToday = currentDate.getTime() === today.getTime();
                    const isStartDate =
                      currentDate.getTime() === startDate.getTime();
                    const isEndDate =
                      currentDate.getTime() === endDate.getTime();

                    if (isStartDate) return "start-date";
                    if (isEndDate) return "end-date";
                    if (
                      currentDate.getTime() > startDate.getTime() &&
                      currentDate.getTime() < endDate.getTime()
                    ) {
                      return "highlight";
                    }
                    if (isToday) return "today";
                    return "normal-day";
                  }}
                  tileContent={({ date }) => {
                    const today = normalizeDate(new Date());
                    const currentDate = normalizeDate(date);
                    const startDate = normalizeDate(
                      new Date(selectedDeparture.startDate),
                    );
                    const endDate = normalizeDate(
                      new Date(selectedDeparture.endDate),
                    );

                    const isToday = currentDate.getTime() === today.getTime();
                    const isStartDate =
                      currentDate.getTime() === startDate.getTime();
                    const isEndDate =
                      currentDate.getTime() === endDate.getTime();
                    const isInRange =
                      currentDate.getTime() > startDate.getTime() &&
                      currentDate.getTime() < endDate.getTime();

                    let label = "";
                    if (isToday) label = "Hôm nay";
                    if (isStartDate) label = "Khởi hành";
                    if (isEndDate) label = "Kết thúc";
                    if (isInRange) label = "Ngày đi";

                    return label ? (
                      <div className="tile-content">
                        <small>{label}</small>
                      </div>
                    ) : null;
                  }}
                  className="shadow-lg rounded-lg bg-white p-4"
                />
              </div>
            </div>
            <div className="date-range">
              <div className="date-highlight">
                <strong>Ngày khởi hành:</strong>{" "}
                {new Date(selectedDeparture.startDate).toLocaleDateString(
                  "vi-VN",
                )}
              </div>
              <div className="date-highlight">
                <strong>Ngày kết thúc:</strong>{" "}
                {new Date(selectedDeparture.endDate).toLocaleDateString(
                  "vi-VN",
                )}
              </div>
            </div>

            <div className="guides-list">
              <strong>Hướng dẫn viên</strong>
              <ul>
                {selectedDeparture.tourGuides.map((guide) => (
                  <li key={guide.guideId}>
                    {guide.fullName} ({guide.experienceYear} năm kinh nghiệm)
                  </li>
                ))}
              </ul>
            </div>

            <div className="pricing-list">
              <strong>Giá</strong>
              {selectedDeparture.tourPricing.map((pricing, index) => (
                <div key={index} className="participant-info">
                  <span>
                    {translateParticipantType(pricing.participantType)}:
                  </span>
                  <span>
                    {pricing.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <p>
                  <strong>Số chỗ còn:</strong>{" "}
                  {selectedDeparture.availableSeats}
                </p>
                <p>
                  <strong>Tổng số người tham gia:</strong>{" "}
                  {selectedDeparture.maxParticipants}
                </p>
              </div>
              <button
                onClick={() => handleDepartureSelect(selectedDeparture)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Chọn chuyến đi
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DepartureDates;
