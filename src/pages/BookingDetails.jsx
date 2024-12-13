import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from "react-router-dom";
import { getBookingId } from '../functions/getBooking';
import FormView from '../components/formView/FormView';
import NavHeader from '../components/navbar/NavHeader';
import ChoosePopup from "../components/popupNotifications/ChoosePopup";
import { updateBookingStatus } from "../functions/bookingTour";
import CustomPop from "../components/popupNotifications/CustomPop";

function BookingDetails() {
  const { id } = useParams();
  const [notify, setNotify] = useState(-1);
  const [dataGenerate, setDataGenerate] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getBookingId(id).then((data) => {
      createForm(data);
    });
  }

  const updateStatus = useCallback(async (bookingId) => {
    const result = await updateBookingStatus(bookingId);
    return result == "Update thành công";
  }, []);

  const createForm = (dataBooking) => {
    debugger
    const data = [
      { label: "Mã booking: ", value: dataBooking.extendBooking.bookingId },
      { label: "Mã lịch trình: ", value: dataBooking.extendBooking.departureId },
      { label: "Khách hàng: ", value: dataBooking.fullName },
      { label: "Tour: ", value: dataBooking.extendBooking.tourName },
      {
        label: "Thời gian: ",
        value:
          new Date(dataBooking.extendBooking.startDate).toLocaleDateString() +
          "-" +
          new Date(dataBooking.extendBooking.endDate).toLocaleDateString(),
      },
      {
        label: "Vị trí bắt đầu: ",
        value: dataBooking.extendBooking.startLocation,
      },
      {
        label: "Số chỗ: ",
        value: `Trẻ em(${dataBooking.participants?.split(",")[0]}), người lớn(${dataBooking.participants.split(",")[1]}), người cao tuổi(${dataBooking.participants.split(",")[2]})`,
      },
      {
        label: "Ngày đặt: ",
        value: new Date(dataBooking.extendBooking.bookingDate).toLocaleString(),
      },
      {
        label: "Nhà cung cấp tour",
        value: dataBooking.extendBooking.tourProviderName
      },
      {
        label: "Thanh toán: ",
        value: dataBooking.extendBooking.paymentDate ? "Đã thanh toán" : "Chưa thanh toán",
      },
      {
        label: "Trạng thái: ",
        value: dataBooking.active ? "Hoạt động" : "Chờ huỷ",
      },
      {
        label: "Huỷ Booking",
        object: {
          type: "button",
          className: "w-100 my-3",
          onClick: () => setNotify(2),
        }
      }
    ];
    setDataGenerate(data);
  }

  return (
    <div>
      <NavHeader textColor="black" />
      <div className='w-100 divCenter'>
        <div className='w-50 divCenter'>
          <FormView title="Thông tin" notIcon={true} data={dataGenerate} />
        </div>
      </div>
      <ChoosePopup
        open={notify == 2}
        onAccept={() => {
          setNotify(-1);
          updateStatus(id).then((result) => {
            if (result) setNotify(1);
            else setNotify(0);
          });
        }}
        message={"Bạn có chắc chắn muốn cập nhật?"}
        onReject={() => setNotify(-1)}
        onclose={() => setNotify(-1)}
        title="Bạn có chắc chắn muốn huỷ booking?"
      />
      <CustomPop
        notify={notify}
        onSuccess={() => setNotify(-1)}
        messageSuccess="Yêu cầu huỷ đang chờ duyệt"
        onFail={() => setNotify(-1)}
      />
    </div>
  )
}

export default BookingDetails