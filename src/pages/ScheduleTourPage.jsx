import React from "react";
import NavHeader from "../components/navbar/NavHeader";
import ScheduleTourBooking from "../components/customer/schedule/ScheduleTourBooking";
import "../style/StylePage.css";
function ScheduleTourPage() {
  return (
    <div>
      <div className="position">
        <div className="nav-header">
          <NavHeader textColor="black" />
        </div>
        <div className="content">
          <ScheduleTourBooking />
        </div>
      </div>
    </div>
  );
}

export default ScheduleTourPage;
