import React from 'react'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import SliderComponent from '../components/slider/SliderComponent';
import '../style/style.css'
import SliderPaging from '../components/slider/SliderPaging';
import TourDetailComponent from '../components/tourDetail/TourDetailComponent';

function TourDetails({ images }) {
  // const navigate = useNavigate();
  return (
    <div>
      <TourDetailComponent images={images}/>
    </div>
  )
}

export default TourDetails