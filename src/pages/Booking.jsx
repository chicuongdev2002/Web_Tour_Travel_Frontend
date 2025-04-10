import React, { useEffect, useRef, useState } from "react";
import "../style/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../functions/format";
import NavHeader from "../components/navbar/NavHeader";
import CustomPop from "../components/popupNotifications/CustomPop";
import FormView from "../components/formView/FormView";
import { FaUser } from "react-icons/fa";
import { MdOutlinePhoneAndroid, MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import InputText from "../components/inputText/InputText";
import ModalBooking from "../components/booking/ModalBooking";
import { useSelector, useDispatch } from "react-redux";
import { savePayment } from "../redux/slice";

function Booking() {
  const dispatch = useDispatch();
  const payment = useSelector((state) => state.payment);
  const navigate = useNavigate();
  const location = useLocation();
  const [notify, setNotify] = useState(-1);
  const [messageNotify, setMessageNotify] = useState("");
  const [numOfChildren, setNumOfChildren] = useState(0);
  const [numOfAdults, setNumOfAdults] = useState(1);
  const [numOfOlds, setNumOfOlds] = useState(0);
  let tourDetail = useRef(location.state).current;
  //Sửa lại
  const selectedDeparture = tourDetail.departures[0];
  const childrenPrice = useRef(
    selectedDeparture.tourPricing.find((d) => d.participantType === "CHILDREN")
      .price,
  ).current;
  const adultsPrice = useRef(
    selectedDeparture.tourPricing.find((d) => d.participantType === "ADULTS")
      .price,
  ).current;
  const oldsPrice = useRef(
    selectedDeparture.tourPricing.find((d) => d.participantType === "ELDERLY")
      .price,
  ).current;
  let user = useRef(
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : {
          userId: 1,
          fullName: "Nguyễn Thanh Sơn",
          phoneNumber: "0923465232",
          email: "son1105@gmail.com",
          address: "TP.HCM",
        },
  ).current;

  const bookingSuccess = () => {
    setNotify(-1);
    navigate("/booking-list");
  };

  const getData = () => {
    return {
      name: tourDetail.tourName,
      type: tourDetail.tourType,
      startLocation: tourDetail.startLocation,
      startDate: formatDate(selectedDeparture.startDate),
      endDate: formatDate(selectedDeparture.endDate),
      destination: tourDetail.destinations.length
        ? tourDetail.destinations.map((d) => d.name)
        : null,
      price:
        numOfChildren * childrenPrice +
        numOfAdults * adultsPrice +
        numOfOlds * oldsPrice,
      customer: user.fullName + " - " + user.phoneNumber + " - " + user.email,
      address: user.addresses[0]?.address,
      user: user.userId,
      departure: selectedDeparture.departureId,
      participants: numOfChildren + "," + numOfAdults + "," + numOfOlds,
    };
  };

  useEffect(() => {
    if (payment.bookingId) {
      setNotify(1);
      dispatch(
        savePayment({
          bookingId: "",
          userId: "",
          departureId: "",
        }),
      );
    }
  }, [payment]);

  const onBookingFail = (message) => {
    setNotify(0);
    setMessageNotify(message);
  };

  return (
    <div>
      <NavHeader textColor="black" />
      <div className="divRowBetween align-items-start px-3">
        <div className="w-80">
          <div className="divRow divCenter">
          <FormView title={tourDetail.tourName}>
              <div>
                <p>Mã lịch trình: {selectedDeparture.departureId}</p>
                <p>Loại tour: {tourDetail.tourType}</p>
                <p>Điểm khởi hành: {tourDetail.startLocation}</p>
                <p>Ngày khởi hành: {formatDate(selectedDeparture.startDate)}</p>
                <p>Ngày kết thúc: {formatDate(selectedDeparture.endDate)}</p>
                <p>Số chỗ trống: {selectedDeparture.availableSeats}</p>
                <p>
                  Lịch trình:{" "}
                  {tourDetail.destinations.length &&
                    tourDetail.destinations.map((d) => d.name).join(" ➪ ")}
                </p>
              </div>
          </FormView>
          <FormView title="Giá vé">
                <div>
                  <div className="divRowBetween">
                    <p className="flex-grow-1">Trẻ em: {childrenPrice} VND</p>
                    <div className="divRow">
                      <p className="flex-grow-1 mr-2">Số lượng:</p>
                      <div style={{ width: 50 }}>
                        <InputText
                          notForm={true}
                          type="number"
                          value={numOfChildren}
                          min={0}
                          onChange={(e) => setNumOfChildren(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="divRowBetween">
                    <p className="flex-grow-1">Người lớn: {adultsPrice} VND</p>
                    <div className="divRow">
                      <p className="flex-grow-1 mr-2">Số lượng:</p>
                      <div style={{ width: 50 }}>
                        <InputText
                          notForm={true}
                          type="number"
                          value={numOfAdults}
                          min={1}
                          onChange={(e) => setNumOfAdults(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="divRowBetween">
                    <p className="flex-grow-1">Người già: {oldsPrice} VND</p>
                    <div className="divRow">
                      <p className="flex-grow-1 mr-2">Số lượng:</p>
                      <div style={{ width: 50 }}>
                        <InputText
                          notForm={true}
                          type="number"
                          value={numOfOlds}
                          min={0}
                          onChange={(e) => setNumOfOlds(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FormView>
          </div>
          <div className="divCenter">
          <div className="w-60">
          <FormView
            title="Lưu ý"
            data={[
              { label: "", value: "Hoàn tiền 100% nếu hủy tour trước 7 ngày. Hoàn tiền 50% nếu hủy tour trong vòng 3-7 ngày. Không hoàn tiền nếu hủy tour trong vòng 48 giờ. Hoàn tiền trong trường hợp tour bị hủy bởi công ty: Trong trường hợp tour bị hủy vì lý do bất khả kháng (thiên tai, dịch bệnh, sự kiện đột xuất…), khách hàng sẽ được hoàn lại toàn bộ số tiền đã thanh toán. Hoàn tiền nếu khách hàng không thể tham gia tour do vấn đề sức khỏe. : Khách hàng có thể yêu cầu hoàn tiền trong trường hợp có chứng nhận y tế xác nhận không thể tham gia tour, với điều kiện hủy ít nhất 3 ngày trước ngày khởi hành." },
            ]}
          />
          </div>
          </div>
        </div>
        <div style={{ flexGrow: 1 }}>
          <FormView
            title="Thông tin"
            titleBackground="yellow"
            data={[
              { label: { icon: <FaUser /> }, value: user.fullName },
              {
                label: { icon: <MdOutlinePhoneAndroid size={25} /> },
                value: user.phoneNumber,
              },
              { label: { icon: <MdEmail size={25} /> }, value: user.email },
              {
                label: { icon: <FaLocationDot size={25} /> },
                value: user.addresses[0] ? user.addresses[0].address : "",
              },
              // {
              //   label: "Ghi chú",
              //   object: {
              //     type: "text",
              //     value: "",
              //     onChange: (e) => console.log(e.target.value),
              //   },
              // },
              {
                label: "Đặt tour",
                object: {
                  type: "button",
                  className: "w-100 my-3",
                  onClick: () => setNotify(-2),
                },
              },
            ]}
          />
        </div>
      </div>
      <ModalBooking
        open={notify === -2}
        onBookingSuccess={() => setNotify(1)}
        tour={getData()}
        onclose={() => setNotify(-1)}
        onBookingFail={onBookingFail}
      />
      <CustomPop
        notify={notify}
        onSuccess={bookingSuccess}
        messageSuccess={"Đặt tour thành công"}
        onFail={() => setNotify(-1)}
        messageFail={messageNotify}
      />
    </div>
  );
}

export default Booking;
