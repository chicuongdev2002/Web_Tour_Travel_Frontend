import React from "react";
import NavHeader from "../components/navbar/NavHeader";
import BookingListComponent from "../components/booking/BookingListComponent";
import { useLocation } from "react-router-dom";

function BookingList() {
  const location = useLocation().state;
  return (
    <div>
      <NavHeader textColor="black" />
      <BookingListComponent data={location}/>
    </div>
  );
}

export default BookingList;
