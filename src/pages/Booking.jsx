import React from 'react'
import '../style/style.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';

function Booking() {
    const location = useLocation();
    return (
        <div className='divRowBetween align-items-start p-5'>
            <div className='w-60'>
                <div className='border border-primary m-2 formBooking'>
                    <h2 className='bg-primary'>Dịch vụ tour</h2>
                    <p>Mã tour: <span>{location.state.tourId}</span></p>
                    <p>Tour yêu cầu: <span>{location.state.tourName}</span></p>
                    <p>Số ngày: <span>{location.state.duration}</span></p>
                </div>
                <div className='border border-primary m-2 formBooking'>
                    <h2 className='bg-primary'>Chi tiết tour</h2>
                    <p>Ngày đặt</p>
                    <p>Ngày khởi hành</p>
                    <p>Ngày kết thúc</p>
                    <p>Trạng thái</p>
                </div>
                <div className='border border-primary m-2 formBooking'>
                    <h2 className='bg-primary'>Lưu ý</h2>
                    <p>Điều kiện hủy tour</p>
                    <p>Điều kiện hoàn tiền</p>
                    <p>Điều kiện thay đổi</p>
                </div>
            </div>
            <div className='w-40 border border-warning m-2'>
                <h2 className='bg-warning text-light'>Thông tin liên lạc</h2>
                <div className='px-3'>
                    <TextField className='w-100 mb-3' id="standard-basic" label="Họ tên" variant="standard" />
                    <TextField className='w-100 mb-3' id="standard-basic" label="Điện thoại" variant="standard" />
                    <TextField className='w-100 mb-3' id="standard-basic" label="Email" variant="standard" />
                    <TextField className='w-100 mb-3' id="standard-basic" label="Địa chỉ" variant="standard" />
                    <TextField className='w-100 mb-3' id="standard-basic" label="Ghi chú" variant="standard" multiline/>
                    <Button className='w-100 mb-3' variant="contained">Xác nhận</Button>
                </div>
            </div>
        </div>
    )
}

export default Booking