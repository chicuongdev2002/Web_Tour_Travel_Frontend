import React, { useState } from 'react'
import NavbarComp from '../components/navbar/Navbar'
import images from '../components/slider/images'
import brand from '../assets/logo.png'
import '../style/style.css'
import { useNavigate } from 'react-router-dom';
import SearchInput from '../functions/SearchInput';
import DivSliderBackground from '../components/divCustom/DivSliderBackground'

function Home() {
  const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
    keyword: '',
    startLocation: '',
    tourType: '',
    participantType: '',
  });
  const goToLogin = () => {
    navigate('/login-register');
  };
  const goToTourList = () => {
    navigate('/tour-list', searchParams);
  };
  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div>
      <DivSliderBackground images={images}>
        <div className='d-flex p-2 divCenter'>
          <img src={brand} style={{ width: 120, height: 115 }} />
          <div style={{ flexGrow: 1 }} className='divRowBetween pr-5'>
            <div>
              <NavbarComp />
            </div>
            <div>
              <button className='ml-2 bg-primary' onClick={goToLogin}>Login</button>
            </div>
            <div>
              <button className='ml-2 bg-success' onClick={goToTourList}>Tour List</button>
            </div>
          </div>
        </div>
        <div className=' justify-content-center align-items-center p-3'>
          <SearchInput onSearch={handleSearch} />  
        </div>
      </DivSliderBackground>
      {/* <div style={{ display: 'flex', flexDirection: 'column', marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
        <h1>Tour nổi bật trong tháng</h1>
        <div style={{ display: 'flex', width: '70%', justifyContent: 'center', alignItems: 'center' }}>
          <SliderComponent quantity={3} images={images} />
        </div>
      </div> */}
    <div>
      {/* <TourList searchParams={searchParams} /> */}
    </div>
    </div>
  );
}

export default Home;