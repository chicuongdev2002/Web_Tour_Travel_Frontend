import React from "react";
import NavHeader from '../components/navbar/NavHeader';
import BookingListComponent from '../components/booking/BookingListComponent';

function BookingList() {
    return (
        <div>
            <NavHeader textColor="black" />
            <BookingListComponent />
        </div>
    );
}

export default BookingList;