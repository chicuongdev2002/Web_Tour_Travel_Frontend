import React, { useState, useEffect, useRef } from 'react';
import NavbarComp from '../navbar/Navbar';
import brand from '../../assets/logo.png';
import '../../style/style.css';
import { useNavigate } from 'react-router-dom';

function NavHeader({ textColor }) {
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        startLocation: '',
        tourType: '',
        participantType: '',
    });
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const toggleDropdown = () => {
        setDropdownVisible(prev => !prev);
    };

    const goToLogin = () => {
        navigate('/login-register');
    };

    const goToTourList = () => {
        navigate('/tour-list', searchParams);
    };

    const goToUserDetail = () => {
        navigate('/user-detail');
        setDropdownVisible(false); // Close dropdown when navigating
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user'); // Clear user data
        setUser(null); // Reset user state
        setDropdownVisible(false); // Close dropdown
        navigate('/'); // Optionally navigate to home
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='d-flex divCenter'>
            <img src={brand} style={{ width: 80, height: 70 }} alt="Brand Logo" />
            <div style={{ flexGrow: 1 }} className='divRowBetween pr-2'>
                <NavbarComp textColor={textColor} />
                <div className='divRowBetween'>
                    {user ? (
                        <div className='dropdown' ref={dropdownRef}>
                            <span className='ml-2' onClick={toggleDropdown}>Xin chào, {user.fullName}</span>
                            {dropdownVisible && (
                                <div className='dropdown-menu' style={{ display: 'block' }}>
                                    <div className='dropdown-item' onClick={goToUserDetail}>
                                        Thông tin khách hàng
                                    </div>
                                    <div className='dropdown-item' onClick={handleLogout}>
                                        Đăng xuất
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className='ml-2 bg-primary' onClick={goToLogin}>Login</button>
                    )}
                    <button className='ml-2 bg-success' onClick={goToTourList}>Tour List</button>
                </div>
            </div>
        </div>
    );
}

export default NavHeader;
