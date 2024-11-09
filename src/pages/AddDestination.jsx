import React from 'react'
import NavHeader from '../components/navbar/NavHeader'
import AddDestinationComponent from '../components/crudDestination/AddDestinationComponent'

function AddDestination() {
  return (
    <div>
      <NavHeader textColor="black" />
      <div className='w-50' style={{ marginLeft: '25%'}}>
        <AddDestinationComponent />
      </div>
    </div>
  )
}

export default AddDestination