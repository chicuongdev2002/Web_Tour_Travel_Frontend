import React, { useState } from 'react'
import NavbarComp from '../navbar/Navbar'
import brand from '../../assets/logo.png'
import '../../style/style.css'
import { useNavigate } from 'react-router-dom';

function NavHeader({ textColor }) {
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        startLocation: '',
        tourType: '',
        participantType: '',
      });
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate('/login-register');
      };
      const goToTourList = () => {
        navigate('/tour-list', searchParams);
      };
    return (
        <div className='d-flex divCenter'>
            <img src={brand} style={{ width: 80, height: 70 }} />
            <div style={{ flexGrow: 1 }} className='divRowBetween pr-2'>
                <NavbarComp textColor={textColor}/>
                <div className='divRowBetween'>
                    <button className='ml-2 bg-primary' onClick={goToLogin}>Login</button>
                    <button className='ml-2 bg-success' onClick={goToTourList}>Tour List</button>
                </div>
            </div>
        </div>
    )
}

export default NavHeader