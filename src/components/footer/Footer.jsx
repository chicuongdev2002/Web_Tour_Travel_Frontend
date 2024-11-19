import React from 'react'
import logo from '../../assets/title.png'

function Footer() {
  return (
    <div className='divRowBetween p-3 align-items-start'>
        <div>
            <img src={logo} alt="Brand Logo" style={{ width: 150, height: 45 }} />
            <h3>Công ty TNHH du lịch Xuyên Việt</h3>
            <h4>Thông tin chuyển khoản</h4>
            <p>STK: 123456789</p>
            <p>Chủ tài khoản: Nguyễn Văn A</p>
            <p>Ngân hàng: Vietcombank</p>
        </div>
        <div>
            <h2>Liên hệ</h2>
            <p>Địa chỉ: 123 đường ABC</p>
            <p>Số điện thoại: 0123456789</p>
            <p>Email: son@gmail.com</p>
            <p>Website: xuyenviettour.com</p>
        </div>
        <div>
            <h2>Giới thiệu</h2>
            <p>Về chúng tôi</p>
            <p>Hướng dẫn thanh toán</p>
            <p>Hướng dẫn đặt tour</p>
        </div>
        <div>
            <h2>Chính sách</h2>
            <p>Chính sách bảo mật</p>
            <p>Chính sách hoàn tiền</p>
            <p>Chính sách đổi trả</p>
        </div>
    </div>
  )
}

export default Footer