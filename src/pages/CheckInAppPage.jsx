import React from "react";
import NavHeader from "../components/navbar/NavHeader";
import CheckInApp from "../components/checkin/CheckInApp";



function CheckInAppPage() {
  return (
    <div>
      <NavHeader textColor="black" />
      <CheckInApp />
    </div>
  );
}

export default CheckInAppPage;
