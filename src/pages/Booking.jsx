import React, { useRef, useState } from "react";
import "../style/style.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../functions/format";
import bookingTour from "../functions/bookingTour";
import NavHeader from "../components/navbar/NavHeader";
import CustomPop from "../components/popupNotifications/CustomPop";
import InputText from "../components/inputText/InputText";
import Input from "@mui/material/Input";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  var [notify, setNotify] = useState(-1);
  const [numOfChildren, setNumOfChildren] = useState(0);
  const [numOfAdults, setNumOfAdults] = useState(1);
  const [numOfOlds, setNumOfOlds] = useState(0);
  let tourDetail = useRef(location.state).current;
  let user = useRef(
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : {
          id: 1,
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
  return (
    <div>
      <NavHeader textColor="black" />
      <div className="divRowBetween align-items-start p-5">
        <div className="w-60">
          <div className="border border-primary m-2 formBooking">
            <h2 className="bg-primary">Dịch vụ tour</h2>
            <p>Mã tour: {tourDetail.tourId}</p>
            <p>Tour yêu cầu: {tourDetail.tourName}</p>
            <p>Số ngày: {tourDetail.duration}</p>
          </div>
          <div className="border border-primary m-2 formBooking">
            <h2 className="bg-primary">Chi tiết tour</h2>
            <div className="divRowBetweenNotAlign">
              <div>
                <p>Mã lịch trình: {tourDetail.departures[0].departureId}</p>
                <p>
                  Ngày khởi hành:{" "}
                  {formatDate(tourDetail.departures[0].startDate)}
                </p>
                <p>
                  Ngày kết thúc: {formatDate(tourDetail.departures[0].endDate)}
                </p>
                <p>Lịch trình: </p>
              </div>
              <div className="border border-primary m-2 w-30">
                <h5 className="bg-primary w-100 text-center">
                  Số người tham gia
                </h5>
                <div className="px-2">
                  <input
                    type="number"
                    className="w-100"
                    min={0}
                    value={numOfChildren}
                    onChange={(e) => setNumOfChildren(e.target.value)}
                  />
                  <input
                    type="number"
                    className="my-2 w-100"
                    min={1}
                    value={numOfAdults}
                    onChange={(e) => setNumOfAdults(e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-100"
                    min={0}
                    value={numOfOlds}
                    onChange={(e) => setNumOfOlds(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border border-primary m-2 formBooking">
            <h2 className="bg-primary">Lưu ý</h2>
            <p>Điều kiện hủy tour</p>
            <p>Điều kiện hoàn tiền</p>
            <p>Điều kiện thay đổi</p>
          </div>
        </div>
        <div className="w-40 border border-warning m-2 formBooking">
          <h2 className="bg-warning text-light">Thông tin liên lạc</h2>
          <div className="px-3">
            <p>Họ và tên: {user.fullName}</p>
            <p>Điện thoại: {user.phoneNumber}</p>
            <p>Email: {user.email}</p>
            {/* <p>Địa chỉ: {user.address}</p> */}
            <TextField
              className="w-100 mb-3"
              id="standard-basic"
              label="Ghi chú"
              variant="standard"
              multiline
            />
            <Button
              className="w-100 mb-3"
              variant="contained"
              onClick={async () => {
                const data = await bookingTour({
                  userId: user.id,
                  departureId: tourDetail.departures[0].departureId,
                  participants:
                    numOfChildren + "," + numOfAdults + "," + numOfOlds,
                });
                if (data) setNotify(1);
                else setNotify(0);
              }}
            >
              Xác nhận
            </Button>
          </div>
        </div>
        <CustomPop
          notify={notify}
          onSuccess={bookingSuccess}
          messageSuccess={"Đặt tour thành công"}
          onFail={() => setNotify(-1)}
        />
      </div>
    </div>
  );
}

export default Booking;
