import React, { useState } from 'react'
import InputText from '../../components/inputText/InputText'
import Button from '@mui/material/Button';
import SelectComponent from '../select/SelectComponent';

function AddTourComponent() {
  const [tourName, setTourName] = useState('');
  const [description, setDescription] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [type, setType] = useState('');

  return (
    <div className=' w-100 border border-primary m-2 formBooking'>
      <h2 className='bg-primary'>Thêm tour</h2>
      <div>
        <InputText label='Tên tour' value={tourName} onChange={(e) => setTourName(e.target.value)} />
        <InputText label='Mô tả' value={description} onChange={(e) => setDescription(e.target.value)} />
        <InputText label='Địa điểm khởi hành' value={startLocation} onChange={(e) => setStartLocation(e.target.value)} />
        <SelectComponent label='Loại tour' listData={[{ family: "FAMILY" }, { group: "GROUP" }]} value={type} onChange={(e) => setType(e)} />
        <Button className='btn btn-primary w-100 mb-3 mt-3' variant="contained">Thêm</Button>
      </div>
    </div>
  )
}

export default AddTourComponent