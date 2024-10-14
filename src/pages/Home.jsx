import React from 'react';
import NavbarComp from '../components/navbar/Navbar';
import images from '../components/slider/images';
import SliderComponent from '../components/slider/SliderComponent';
import brand from '../assets/logo.png';
import '../style/style.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  
  const goToLogin = () => {
    navigate('/login-register');
  };
  const goToApp = () => {
    navigate('/app');
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px' }}>
      <header className='d-flex justify-content-between align-items-center p-3'>
        <img src={brand} alt="Brand Logo" style={{ width: 120, height: 120 }} />
        <div style={{ flexGrow: 1, marginLeft: '20px' }}>
          <div className='d-flex justify-content-between'>
            <div>
              <button className='btn btn-primary ml-2' onClick={goToLogin}>Login</button>
              <button className='btn btn-success ml-2' onClick={goToApp}>Xem Tour</button>
            </div>
          </div>
          <NavbarComp />
             <div className='input-group w-75'>
              <input className='form-control' type='text' placeholder='Tìm kiếm' />
              <button className='btn btn-success ml-2'>Search</button>
            </div>
        </div>
      </header>

      <main className='text-center'>
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