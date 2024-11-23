import React, { useEffect, useCallback, useState } from "react";
import {
  getAllBooking,
  updateBookingStatus,
} from "../../functions/bookingTour";
import Switch from "@mui/material/Switch";
import CustomPop from "../../components/popupNotifications/CustomPop";
import ChoosePopup from "../../components/popupNotifications/ChoosePopup";
import TableComponent from "../../components/table/TableComponent";

function BookingListComponent() {
  const [notify, setNotify] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  });

  useEffect(() => {
    getBooking();
  }, []);

  const getBooking = useCallback(async (page, size) => {
    const result = await getAllBooking(page, size);
    setBookings(result.content);
    setPage(result.page);
  }, []);

  const updateStatus = useCallback(async (bookingId) => {
    const result = await updateBookingStatus(bookingId);
    return result == "Update thành công";
  }, []);

  const convertData = useCallback((data) => {
    return data.map((d) => {
      return {
        "Booking ID": d.bookingId,
        "Khách hàng": d.user.fullName,
        Tour: d.departure.tour.tourName,
        "Mô tả": d.departure.tour.tourDescription,
        "Ngày bắt đầu": new Date(d.departure.startDate).toLocaleDateString(),
        "Ngày kết thúc": new Date(d.departure.endDate).toLocaleDateString(),
        "Vị trí bắt đầu": d.departure.tour.startLocation,
        "Số ghế còn trống": d.departure.availableSeats,
        "Ngày đặt": new Date(d.bookingDate).toLocaleString(),
        "Trạng thái": (
          <Switch
            checked={d.active}
            onChange={() => {
              setSelectedStatus(d.bookingId);
              setNotify(2);
            }}
          />
        ),
      };
    });
  });

  return (
    <div>
      <TableComponent
        headers={[
          "Booking ID",
          "Khách hàng",
          "Tour",
          "Mô tả",
          "Ngày bắt đầu",
          "Ngày kết thúc",
          "Vị trí bắt đầu",
          "Số ghế còn trống",
          "Ngày đặt",
          "Trạng thái",
        ]}
        data={convertData(bookings)}
        page={page}
        getData={getBooking}
      />
      <CustomPop
        notify={notify}
        onSuccess={() => setNotify(-1)}
        messageSuccess={"Cập nhật thành công"}
        onFail={() => setNotify(-1)}
      />
      {notify == 2 && (
        <ChoosePopup
          open={notify == 2}
          onAccept={() => {
            setNotify(-1);
            if (updateStatus(selectedStatus)) setNotify(1);
            else setNotify(0);
          }}
          message={"Bạn có chắc chắn muốn cập nhật?"}
          onReject={() => setNotify(-1)}
          onclose={() => setNotify(-1)}
          title={"Cập nhật trạng thái booking"}
        />
      )}
    </div>
  );
}

export default BookingListComponent;
