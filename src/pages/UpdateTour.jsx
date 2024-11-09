import React from 'react'
import NavHeader from '../components/navbar/NavHeader'
import { useLocation } from 'react-router-dom'
import UpdateTourComponent from '../components/crudTour/UpdateTourComponent';

function UpdateTour() {
    const data = useLocation().state;
  return (
    <div>
        <NavHeader textColor="black" />
        <UpdateTourComponent data={data}/>
    </div>
  )
}

export default UpdateTour