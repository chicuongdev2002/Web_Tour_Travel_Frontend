import React from "react";
import SuccessPopup from "../components/popupNotifications/SuccessPopup";

function Payment() {
  return (
    <div>
      <SuccessPopup
        message={"Đơn hàng đã được thanh toán"}
        open={open}
        onClose={() => {}}
        onClick={() => {
          window.close();
        }}
      />
    </div>
  );
}

export default Payment;
