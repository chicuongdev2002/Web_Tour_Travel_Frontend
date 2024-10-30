import React, { useRef } from 'react'
import '../style/style.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { formatDate } from '../functions/format'
import bookingTour from '../functions/bookingTour'

function Booking() {
    const location = useLocation();
    let tourDetail = useRef(location.state).current;
    let user = useRef(sessionStorage.getItem("user")? 
        JSON.parse(sessionStorage.getItem("user")) : 
        {   id: 1,
            fullName:"Nguyễn Thanh Sơn",
            phoneNumber: "0923465232",
            email: "son1105@gmail.com",
            address: "TP.HCM"
        }).current;
    return (
        <div className='divRowBetween align-items-start p-5'>
            <div className='w-60'>
                <div className='border border-primary m-2 formBooking'>
                    <h2 className='bg-primary'>Dịch vụ tour</h2>
                    <p>Mã tour: {tourDetail.tourId}</p>
                    <p>Tour yêu cầu: {tourDetail.tourName}</p>
                    <p>Số ngày: {tourDetail.duration}</p>
                </div>
                <div className='border border-primary m-2 formBooking'>
                    <h2 className='bg-primary'>Chi tiết tour</h2>
                    <p>Ngày khởi hành: {formatDate(tourDetail.departures[0].startDate)}</p>
                    <p>Ngày kết thúc: {formatDate(tourDetail.departures[0].endDate)}</p>
                    <p>Lịch trình: </p>
                </div>
                <div className='border border-primary m-2 formBooking'>
                    <h2 className='bg-primary'>Lưu ý</h2>
                    <p>Điều kiện hủy tour</p>
                    <p>Điều kiện hoàn tiền</p>
                    <p>Điều kiện thay đổi</p>
                </div>
            </div>
            <div className='w-40 border border-warning m-2 formBooking'>
                <h2 className='bg-warning text-light'>Thông tin liên lạc</h2>
                <div className='px-3'>
                    <p>Họ và tên: {user.fullName}</p>
                    <p>Điện thoại: {user.phoneNumber}</p>
                    <p>Email: {user.email}</p>
                    {/* <p>Địa chỉ: {user.address}</p> */}
                    <TextField className='w-100 mb-3' id="standard-basic" label="Ghi chú" variant="standard" multiline/>
                    <Button className='w-100 mb-3' variant="contained"
                        onClick={() => bookingTour({ userId: user.id, departureId: 1, participants: '0,1,0'})}>
                        Xác nhận
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Booking