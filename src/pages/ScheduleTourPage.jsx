import React from "react";
import NavHeader from "../components/navbar/NavHeader";
import FavoriteTourListComponent from "../components/tourfavorite/FavoriteTourListComponent";
import ScheduleTourBooking from "../components/customer/schedule/ScheduleTourBooking";


function ScheduleTourPage() {
  return (
    <div>
      <NavHeader textColor="black" />
      <ScheduleTourBooking />
    </div>
  );
}

export default ScheduleTourPage;
