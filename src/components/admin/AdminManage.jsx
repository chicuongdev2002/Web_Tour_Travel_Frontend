import React, {useState} from 'react'
import '../admin/style.css'
import AccountManagement from '../account/AccountManagement'
import CustomerManagement from '../customer/CustomerManagement'
import DiscountManagement from '../discount/DiscountManagement'
import BookingListComponent from '../booking/BookingListComponent'
import { MdAccountCircle, MdCardTravel, MdCircleNotifications } from "react-icons/md";
import { FaKey } from "react-icons/fa6";
import { PiNotepadFill } from "react-icons/pi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { IoBarChartSharp } from "react-icons/io5";

function AdminPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [select, setSelect] = useState('account')
  const handleSelect = (value) => {
    setSelect(value)
  }
  const user = JSON.parse(sessionStorage.getItem('user'))
  return (
    <div>
      <div className="d-flex justify-content-between my-2 px-3">
        <button className="bg-primary" onClick={() => { window.history.back() }}>Back</button>
        <h5>Xin chào <b>{user?.fullName}!</b></h5>
      </div>
      <div className='w-100 divRowBetweenNotAlign'>
        <div className={`drawer ${isOpen ? 'open' : ''} bg-dark h-100`}
          onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
          <div className={`divRow ${select == 'account' ? 'elementSelected' : 'element'}`}>
            <FaKey size={30} />
            {isOpen && <p className='one-line-text' onClick={() => handleSelect('account')}>Quản lý tài khoản</p>}
          </div>
          <div className={`divRow ${select == 'customer' ? 'elementSelected' : 'element'}`}>
            <MdAccountCircle size={30} />
            {isOpen && <p className='one-line-text' onClick={() => handleSelect('customer')}>Quản lý khách hàng</p>}
          </div>
          <div className={`divRow ${select == 'tour' ? 'elementSelected' : 'element'}`}>
            <MdCardTravel size={30} />
            {isOpen && <p className='one-line-text' onClick={() => handleSelect('tour')}>Quản lý tour</p>}
          </div>
          <div className={`divRow ${select == 'booking' ? 'elementSelected' : 'element'}`}>
            <PiNotepadFill size={30} />
            {isOpen &&<p className='one-line-text' onClick={() => handleSelect('booking')}>Quản lý đơn đặt tour</p>}
          </div>
          <div className={`divRow ${select == 'discount' ? 'elementSelected' : 'element'}`}>
            <RiDiscountPercentFill size={30} />
            {isOpen && <p className='one-line-text' onClick={() => handleSelect('discount')}>Quản lý mã giảm giá</p>}
          </div>
          <div className={`divRow ${select == 'notify' ? 'elementSelected' : 'element'}`}>
            <MdCircleNotifications size={30} />
            {isOpen && <p className='one-line-text' onClick={() => handleSelect('notify')}>Thông báo</p>}
          </div>
          <div className={`divRow ${select == 'statistic' ? 'elementSelected' : 'element'}`}>
            <IoBarChartSharp size={30} />
            {isOpen && <p className='one-line-text' onClick={() => handleSelect('statistic')}>Thống kê</p>}
          </div>
        </div>
        <div className='ruler' />
        <div className='content'>
          {select === 'account' && <AccountManagement />}
          {select === 'customer' && <CustomerManagement />}
          {select === 'discount' && <DiscountManagement />}
          {select === 'booking' && <BookingListComponent />}
        </div>
      </div>
    </div>
  )
}

export default AdminPage