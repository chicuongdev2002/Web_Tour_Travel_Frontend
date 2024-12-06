import React from "react";
import NavHeader from "../components/navbar/NavHeader";
import TourScheduleComponent from "../components/tourguide/TourScheduleComponent";
import '../style/StylePage.css'
function ScheduleTourGuidePage() {
  return (
    <div className="position">
      <div className="nav-header">
        <NavHeader textColor="black" />
      </div>
      <div className="content">
        <TourScheduleComponent />
      </div>
    </div>
  );
}

export default ScheduleTourGuidePage;