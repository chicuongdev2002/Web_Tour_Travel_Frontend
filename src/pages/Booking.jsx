import React from 'react'
import '../style/style.css'
import { useNavigate } from 'react-router-dom';

function Booking() {
    const navigate = useNavigate();
    return (
        <div className='divRowBetween align-items-start p-5'>
            <div className='w-60'>
                <div className='border border-primary m-2'>
                    <h2 className='bg-primary'>Dịch vụ tour</h2>
                    <p>Mã tour</p>
                    <p>Tour yêu cầu</p>
                    <p>Số ngày</p>
                </div>
                <div className='border border-primary m-2'>
                    <h2 className='bg-primary'>Chi tiết tour</h2>
                    <p>Mã booking</p>
                    <p>Ngày đặt</p>
                    <p>Ngày khởi hành</p>
                    <p>Ngày kết thúc</p>
                    <p>Trạng thái</p>
                </div>
                <div className='border border-primary m-2'>
                    <h2 className='bg-primary'>Lưu ý</h2>
                    <p>Điều kiện hủy tour</p>
                    <p>Điều kiện hoàn tiền</p>
                    <p>Điều kiện thay đổi</p>
                </div>
            </div>
            <div className='w-40 border border-warning m-2'>
                <h2 className='bg-warning'>Thông tin liên lạc</h2>
                <p>Họ và tên</p>
                <p>Email</p>
                <p>Số điện thoại</p>
                <p>Địa chỉ</p>
                <p>Yêu cầu khác</p>
                <button className='btn btn-primary'>Xác nhận</button>
            </div>
        </div>
    )
}

export default Booking