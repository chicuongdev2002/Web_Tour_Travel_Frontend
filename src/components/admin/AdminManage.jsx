import React, { useState } from 'react'
import '../admin/style.css'
import AccountManagement from '../account/AccountManagement'
import CustomerManagement from '../customer/CustomerManagement'
import TourList from '../tourList/TourList'
import DiscountManagement from '../discount/DiscountManagement'
import BookingListComponent from '../booking/BookingListComponent'
import NotifyComponent from '../notify/NotifyComponent'
import { MdAccountCircle, MdCardTravel, MdCircleNotifications } from "react-icons/md";
import { FaKey } from "react-icons/fa6";
import { PiNotepadFill } from "react-icons/pi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { IoBarChartSharp } from "react-icons/io5";
import { IoIosAlarm } from "react-icons/io";

function AdminPage({ changeTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [select, setSelect] = useState('system')
  const handleSelect = (value) => {
    changeTitle(value === 'system' ? 'Quản lý hệ thống' :
      value === 'account' ? 'Quản lý tài khoản' :
      value === 'customer' ? 'Quản lý khách hàng' :
      value === 'tour' ? 'Quản lý tour' :
      value === 'booking' ? 'Quản lý đơn đặt tour' :
      value === 'discount' ? 'Quản lý mã giảm giá' :
      value === 'notify' ? 'Thông báo' : 
      value === 'KPI' ? 'Quản lý KPI hướng dẫn viên' : 'Thống kê'
    )
    setSelect(value)
  }

  return (
    <div style={{ flexGrow: 1, overflow: 'auto' }} className='w-100 divRowBetweenNotAlign'>
      <div className={`drawer ${isOpen ? 'open' : ''} bg-dark h-100`}
        // style={{minWidth: isOpen ? '250px' : '0'}}
        onMouseEnter={() => setIsOpen(true)} 
        onMouseLeave={() => setIsOpen(false)}
        >
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
          {isOpen && <p className='one-line-text' onClick={() => handleSelect('booking')}>Quản lý đơn đặt tour</p>}
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
        <div className={`divRow ${select == 'KPI' ? 'elementSelected' : 'element'}`}>
          <IoIosAlarm size={30} />
          {isOpen && <p className='one-line-text' onClick={() => handleSelect('KPI')}>Quản lý KPI</p>}
        </div>
      </div>
      <div className='ruler' />
      <div className={`content h-100 ${isOpen ? 'open' : ''}`}>
        {select === 'account' && <AccountManagement notTitle={true} />}
        {select === 'customer' && <CustomerManagement notTitle={true} />}
        {select === 'tour' && <TourList />}
        {select === 'discount' && <DiscountManagement notTitle={true} />}
        {select === 'booking' && <BookingListComponent />}
        {select === 'notify' && <NotifyComponent />}
      </div>
    </div>
  )
}

export default AdminPage