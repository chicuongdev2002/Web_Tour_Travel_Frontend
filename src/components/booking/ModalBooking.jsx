import React from "react";
import ModalComponent from "../modal/ModalComponent";
import FormView from "../formView/FormView";
import SelectComponent from "../select/SelectComponent";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import { createLinkMomoPayment } from "../../functions/payment";
import { v4 as uuidv4 } from "uuid";
import bookingTour from "../../functions/bookingTour";
import { formatMoneyVND } from "../../functions/format";
import { ClipLoader } from "react-spinners";

function ModalBooking({
  open,
  onclose,
  tour,
  onBookingSuccess,
  onBookingFail,
}) {
  const [value, setValue] = React.useState("cash");
  const [pending, setPending] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleCreatePayment = async () => {
    const uuid = uuidv4();
    if (value == "cash") {
      setIsLoading(true);
      setPending(true);
      const data = {
        bookingID: uuid,
        userId: tour.user,
        departureId: tour.departure,
        participants: tour.participants,
        address: tour.address,
        paymentMethod: "cash",
      };
      const result = await bookingTour(data);
      if (result) onBookingSuccess();
      else onBookingFail("Đã xảy ra lỗi!");
      setPending(false);
    } else {
      debugger;
      setPending(true);
      const result = await createLinkMomoPayment(
        tour.price,
        uuid,
        tour.user,
        tour.departure,
        tour.participants,
        tour.address,
      );
      if (result.data) window.open(result.data.payUrl, "_blank");
      else {
        onBookingFail(result.response.data);
        setPending(false);
      }
    }
    setIsLoading(false);
  };

  return (
    <ModalComponent open={open} onclose={pending ? null : onclose}>
      {isLoading ? (
        <div className="divCenterColumn">
          <h5 className="mx-3">Xin đợi một lát,</h5>
          <h5>thông tin booking đang được gửi tới email của bạn...</h5>
          <ClipLoader color="#36d7b7" />
        </div>
      ) : (
        <FormView title={tour.name}>
          <div
            className="text-center py-2 d-flex flex-column justify-content-start"
            style={{ textAlign: "left" }}
          >
            <h5 style={{ textAlign: "start" }} className="m-0">
              Khách hàng: {tour.customer}
            </h5>
            <h5 style={{ textAlign: "start" }} className="m-0 my-2">
              Địa chỉ: {tour.address}
            </h5>
            <h5 style={{ textAlign: "start" }} className="m-0">
              Loại tour: {tour.type}
            </h5>
            <h5 style={{ textAlign: "start" }} className="m-0 my-2">
              Điểm khởi hành: {tour.startLocation}
            </h5>
            <h5 style={{ textAlign: "start" }} className="m-0">
              Ngày khởi hành: {tour.startDate}
            </h5>
            <h5 style={{ textAlign: "start" }} className="m-0 my-2">
              Ngày kết thúc: {tour.endDate}
            </h5>
            <h5 style={{ textAlign: "start" }} className="m-0">
              Điểm đến: {tour.destination?.join(" ➪ ")}
            </h5>
            <h5 style={{ textAlign: "start" }} className="m-0 my-2">
              Giá vé: {formatMoneyVND(tour.price)}
            </h5>
            <div className="divRow">
              <h5 style={{ textAlign: "start" }} className="m-0 w-30 h-100">
                Thanh toán:
              </h5>
              <RadioGroup
                style={{ flexDirection: "row" }}
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label="Tiền mặt"
                />
                <FormControlLabel
                  value="momo"
                  control={<Radio />}
                  label="Ví momo"
                />
              </RadioGroup>
            </div>
            <button
              className="btn btn-primary"
              onClick={pending ? null : handleCreatePayment}
            >
              {pending ? "Đang chờ thanh toán" : "OK"}
            </button>
          </div>
        </FormView>
      )}
    </ModalComponent>
  );
}

export default ModalBooking;
