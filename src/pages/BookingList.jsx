import React, { useEffect, useCallback, useState } from 'react'
import { getAllBooking } from '../functions/bookingTour'
import { Table } from 'react-bootstrap';
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
import NavHeader from '../components/navbar/NavHeader';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  });

  useEffect(() => {
    getBooking();
  }, [])

  const getBooking = useCallback(async (page, size) => {
    const result = await getAllBooking(page, size);
    setBookings(result.content);
    setPage(result.page);
  }, [])

  return (
    <div>
      <NavHeader textColor="black"/>
      <div className="booking-table">
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Khách hàng</th>
                    <th>Tour</th>
                    <th>Mô tả</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Vị trí bắt đầu</th>
                    <th>Số ghế còn trống</th>
                    <th>Ngày đặt</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <tr key={booking.bookingId}>
                            <td>{booking.bookingId}</td>
                            <td>{booking.user.fullName}</td>
                            <td>{booking.departure.tour.tourName}</td>
                            <td>{booking.departure.tour.tourDescription}</td>
                            <td>{new Date(booking.departure.startDate).toLocaleDateString()}</td>
                            <td>{new Date(booking.departure.endDate).toLocaleDateString()}</td>
                            <td>{booking.departure.tour.startLocation}</td>
                            <td>{booking.departure.availableSeats}</td>
                            <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                            <td>{booking.active ? 'Hoạt động' : 'Không hoạt động'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="10" className="text-center">Không có dữ liệu booking.</td>
                    </tr>
                )}
            </tbody>
        </Table>
        <div className="pagination w-100 divCenter">
            <GrCaretPrevious className='mr-2' onClick={()=>{
                if(page.number > 0)
                    getBooking(page.number - 1, page.size);
            }}/>
            <p>Trang {page.number + 1} / {page.totalPages}</p>
            <GrCaretNext className='ml-2'
                onClick={()=>{
                    if(page.number < page.totalPages - 1)
                        getBooking(page.number + 1, page.size);
                }}
            />
        </div>
    </div>
    </div>
);
}

export default BookingList