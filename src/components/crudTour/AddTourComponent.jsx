import React from 'react'
import InputText from '../../components/inputText/InputText'

function AddTourComponent() {
  return (
      <div className='border border-primary m-2 formBooking'>
          <h2 className='bg-primary'>Thêm tour</h2>
          <InputText label='Tên tour' />
          <InputText label='Mô tả' />
          <InputText label='Địa điểm khởi hành' />
          <InputText label='Loại tour' />
          <button className='btn btn-primary'>Thêm</button>
      </div>
  )
}

export default AddTourComponent