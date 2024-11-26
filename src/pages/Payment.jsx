import React from 'react'
import SuccessPopup from '../components/popupNotifications/SuccessPopup'

function Payment() {
  return (
    <div>
      <SuccessPopup message={"Đơn hàng đã được thanh toán!"} open={true} onClose={() => { }} onClick={() => {
        window.close()
      }} />
    </div>
  )
}

export default Payment