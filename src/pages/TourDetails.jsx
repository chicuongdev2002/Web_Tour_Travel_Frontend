import React from 'react'
import logo from '../assets/logo.png'

function TourDetails() {
  return (
    <div className='divRow'>
        <img src={logo} style={{ width: 500, height: 500}}/>
        <div>
        <h2>Du lịch Phú Quốc</h2>
        <h3 className='text-danger'>10,000,000đ</h3>
        <p>Description</p>
        </div>
    </div>
  )
}

export default TourDetails