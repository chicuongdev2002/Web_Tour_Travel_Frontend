import React, { useEffect } from 'react'
import SuccessPopup from '../components/popupNotifications/SuccessPopup'
import { useSelector } from 'react-redux';
import ModalComponent from '../components/modal/ModalComponent';
import { ClipLoader } from 'react-spinners';

function Payment() {
  const [open, setOpen] = React.useState(true);
  const payment = useSelector(state => state.payment)
  useEffect(() => {
    if (payment.bookingId) {
      window.close()
    }
  }, [payment])
  return (
    <div>
      <SuccessPopup message={"Đơn hàng đã được thanh toán"} open={open} onClose={() => { }} onClick={() => {
        setOpen(false)
      }} />
      <ModalComponent open={!open} title="Đơn đặt tour đang khởi tạo">
      <div className='divCenterColumn'>
        <h5 className='mx-3'>Xin đợi một lát,</h5>
        <h5>thông tin booking đang được gửi tới email của bạn...</h5>
        <ClipLoader color="#36d7b7" />
      </div>
      </ModalComponent>
    </div>
  )
}

export default Payment