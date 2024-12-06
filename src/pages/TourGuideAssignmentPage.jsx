import React from "react";
import NavHeader from "../components/navbar/NavHeader";
import TourGuideAssignments from "../components/tourguide/TourGuideAssignments";
import "../style/StylePage.css";
function TourGuideAssignmentPage() {
  return (
    <div>
      <div className="position">
        <div className="nav-header">
          <NavHeader textColor="black" />
        </div>
        <div className="content">
          <TourGuideAssignments />
        </div>
      </div>
    </div>
  );
}

export default TourGuideAssignmentPage;
