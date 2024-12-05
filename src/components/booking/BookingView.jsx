import React, { useEffect } from "react";
import ModalComponent from "../modal/ModalComponent";
import FormView from "../formView/FormView";
import { getBooking, cancelBooking } from "../../functions/bookingTour";
import { formatDate } from "../../functions/format";
import CustomPopup from "../popupNotifications/CustomPop";

function BookingView({ open, onClose, bookingId }) {
  const [booking, setBooking] = React.useState({});
  const [notify, setNotify] = React.useState(-1);
  useEffect(() => {
    getBookingData();
  }, []);

  const getBookingData = async () => {
    const result = await getBooking(bookingId);
    setBooking(result);
  };

  const handleCancel = async () => {
    const result = await cancelBooking(bookingId, booking.user.userId);
    if (result) setNotify(1);
    else setNotify(0);
  };

  return (
    <ModalComponent open={open} onclose={onClose} title="Thông tin booking">
      <FormView>
        {booking.bookingId ? (
          <div>
            <div className="divRowBetweenNotAlign px-4">
              <h5 className="p-0">Mã đơn: </h5>
              <h5 className="p-0">{booking.bookingId}</h5>
            </div>
            <div className="divRowBetweenNotAlign px-4">
              <h5 className="p-0">Khách hàng: </h5>
              <h5 className="p-0">
                {booking.user?.userId} - {booking.user?.fullName} -{" "}
                {booking.user?.phoneNumber}
              </h5>
            </div>
            <div className="divRowBetweenNotAlign px-4">
              <h5 className="p-0">Email: </h5>
              <h5 className="p-0">{booking.user?.email}</h5>
            </div>
            <div className="divRowBetweenNotAlign px-4">
              <h5 className="p-0">Mã tour: </h5>
              <h5 className="p-0">{booking.departure?.tour?.tourId}</h5>
            </div>
            <div className="divRowBetweenNotAlign px-4">
              <h5 className="p-0">Tên tour: </h5>
              <h5 className="p-0">{booking.departure?.tour?.tourName}</h5>
            </div>
            <div className="divRowBetweenNotAlign px-4">
              <h5 className="p-0">Mã lịch trình: </h5>
              <h5 className="p-0">{booking.departure?.departureId}</h5>
            </div>
            <div className="divRowBetweenNotAlign px-4">
              <h5 className="p-0">Ngày khởi hành: </h5>
              <h5 className="p-0">
                {formatDate(booking.departure?.startDate ?? "")}
              </h5>
            </div>
            <div className="divRowBetweenNotAlign px-4">
              <h5 className="p-0">Ngày đặt: </h5>
              <h5 className="p-0">{formatDate(booking.bookingDate)}</h5>
            </div>
            <div className="divRowBetweenNotAlign px-4">
              <h5 className="p-0">Số lượng: </h5>
              <h5 className="p-0">{`Trẻ em(${booking.participants?.split(",")[0]}), nguời lớn(${booking.participants?.split(",")[1]}), người già(${booking.participants?.split(",")[2]})`}</h5>
            </div>
            <div className="divRow justify-content-center w-100 my-2">
              <button className="btn btn-primary" onClick={handleCancel}>
                Huỷ
              </button>
              <button className="btn btn-primary" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <h5 className="mx-4">Booking đã được huỷ</h5>
        )}
      </FormView>
      <CustomPopup
        notify={notify}
        onSuccess={() => {
          setNotify(-1);
          onClose();
        }}
        messageSuccess="Huỷ booking thành công"
        onFail={() => {
          setNotify(-1);
          onClose();
        }}
        messageFail="Huỷ booking thất bại"
      />
    </ModalComponent>
  );
}

export default BookingView;
