import React from 'react'
import NavbarComp from '../components/navbar/Navbar'
import images from '../components/slider/images'
import Slider from '../components/slider/Slider'
import SliderComponent from '../components/slider/SliderComponent'

function Home() {
  return (
    <div style={{ backgroundColor: 'lightgray'}}>
      <NavbarComp />
      {/* <Slider quantity={1}>
        {images.map((image, index) => {
          return <img style={{ height: 300, width: '100%' }} key={index} src={image.imgURL} alt={image.imgAlt} />;
        })}
      </Slider> */}
      <SliderComponent quantity={1} images={images}/>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 100, justifyContent: 'center', alignItems: 'center'}}>
        <h1>Tour nổi bật trong tháng</h1>
        <div style={{ display: 'flex', width: '70%', justifyContent: 'center', alignItems: 'center'}}>
        <SliderComponent quantity={3} images={images}/>
        </div>
      </div>
    </div>
  )
}

export default Home