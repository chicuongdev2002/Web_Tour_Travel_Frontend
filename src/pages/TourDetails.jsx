import React from 'react'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';

function TourDetails() {
  const navigate = useNavigate();
  return (
    <div className='divRow'>
          <div className='w-50'>
            <img src={logo} style={{ width: 500, height: 500}}/>
          </div>
          <div className='w-50 d-flex justify-content-center align-items-start flex-column'>
            <h2>Du lịch Phú Quốc</h2>
            <h3 className='text-danger'>10,000,000đ</h3>
            <p>Description</p>
            <button className='btn btn-primary' onClick={()=>{navigate('/booking')}}>Đặt tour</button>
        </div>
    </div>
  )
}

export default TourDetails