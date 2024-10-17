import React, { useState, useEffect } from 'react';
import NavbarComp from '../components/navbar/Navbar';
import images from '../components/slider/images';
import SliderComponent from '../components/slider/SliderComponent';
import TourList from './TourList';
import brand from '../assets/logo.png';
import '../style/style.css';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../functions/SearchInput';
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
  const goToApp = () => {
    navigate('/app');
  };
  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px' }}>
      <header className='d-flex justify-content-between align-items-center p-3'>
        <div style={{ flexGrow: 1, marginLeft: '20px' }}>
          <div className='d-flex justify-content-between'>
            <div></div>
            <div>
             <button className='btn btn-primary ml-2' onClick={goToLogin}>
                <i className="fas fa-sign-in-alt"></i> Đăng nhập
              </button>
              <button className='btn btn-success ml-2' onClick={goToApp}>Xem Tour</button>
            </div>
          </div>
          <NavbarComp />
           <div className=' justify-content-center align-items-center p-3'>
          <SearchInput onSearch={handleSearch} />  
            </div>
       
        </div>
      </header>

      <main className='text-center' style={{ marginTop: '70px' }}>
          <div className="d-flex justify-content-center">
          <TourList searchParams={searchParams} />
         </div>
        <SliderComponent quantity={1} images={images} />
        <section style={{ marginTop: '100px' }}>
          <h1 className='mb-4'>Tour nổi bật trong tháng</h1>
          <div className='d-flex justify-content-center'>
            <SliderComponent quantity={3} images={images} />
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: '#343a40', color: 'white', padding: '20px', textAlign: 'center' }}>
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;