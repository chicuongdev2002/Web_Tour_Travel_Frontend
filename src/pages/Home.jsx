import React from 'react'
import NavbarComp from '../components/navbar/Navbar'
import images from '../components/slider/images'
import SliderComponent from '../components/slider/SliderComponent'
import brand from '../assets/logo.png'
import '../style/style.css'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate('/login-register');
  };
  const goToApp = () => {
    navigate('/app');
  }

  return (
    <div style={{ backgroundColor: 'lightgray'}}>
      <div className='d-flex pl-5 p-2 divCenter'>
        <img src={brand} style={{ width: 120, height: 120 }} />
        <div style={{ flexGrow: 1 }}>
          <div className='w-75 ml-5 d-flex justify-content-between'>
            <div className='divRow'>
              <input className='form-control' type='text' placeholder='Tìm kiếm' />
              <button className='ml-2 bg-success'>Search</button>
            </div>
            <div>
            <button className='ml-2 bg-primary' onClick={goToLogin}>Login</button>
            <button className='ml-2 bg-success' onClick={goToApp}>Xem Tour</button>
            </div>
          </div>
          <div>
          <NavbarComp />
          </div>
        </div>
      </div>
      <div className='divRow'>
      <div className='d-flex w-25' style={{ flexDirection: 'column', justifyContent: 'space-between'}}>
            <div className='divRow mt-2 p-3'>
              <input className='form-control' type='text' placeholder='Tìm kiếm' />
              <button className='ml-2 bg-success'>Search</button>
            </div>
            <h5>Tour gia đình</h5>
            <h5>Tour theo đoàn</h5>
            <h5>Tour tỉnh</h5>
            <h5>Tour nghỉ dưỡng</h5>
            <h5>Tour team building</h5>
            <h5>Tour trải nghiệm</h5>
            <h5>Tour cá nhân</h5>
            <h5>Tour học sinh</h5>
            <h5>Tour sinh viên</h5>
            <h5>Tour người cao tuổi</h5>
            <h5>Tour người độc thân</h5>
      </div>
      <SliderComponent quantity={1} images={images}/>
      </div>
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