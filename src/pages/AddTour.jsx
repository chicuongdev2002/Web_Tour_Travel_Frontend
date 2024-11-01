import React from 'react'
import AddTourComponent from '../components/crudTour/AddTourComponent'
import NavHeader from '../components/navbar/NavHeader'

function AddTour() {
  return (
    <div>
      <NavHeader textColor="black" />
      <div className='w-100'>
        <AddTourComponent />
      </div>
    </div>
  )
}

export default AddTour