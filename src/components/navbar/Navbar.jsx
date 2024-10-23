import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './navbarStyle.css';
import title from '../../assets/title.png'
import React, { useState } from 'react';
function NavbarComp() {
  const [showDropdown, setShowDropdown] = useState(null);

  const regions = {
    'Miền Bắc': ['Hà Nội', 'Hạ Long', 'Sapa', 'Ninh Bình'],
    'Miền Trung': ['Đà Nẵng', 'Huế', 'Nha Trang', 'Phú Yên'],
    'Miền Nam': ['TP. Hồ Chí Minh', 'Phú Quốc', 'Cần Thơ', 'Vũng Tàu'],
  };

  function CustomDropdown({ title, items }) {
    return (
      <NavDropdown
        show={showDropdown === title}
        onMouseEnter={() => setShowDropdown(title)}
        onMouseLeave={() => setShowDropdown(null)}
        className="custom-dropdown"
        title={title}
      >
        {items.map((item, index) => (
          <NavDropdown.Item key={index} href={`#${item}`} className="dropdown-item">
            {item}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    );
  }

  function CustomNavBarItem({item}){
    return (
      <Nav.Link className='navbarElement' href="#home">
        <div className='divCenter' style={{ width: 120 }}>
          <p className='divCenter' style={{ fontSize: 25, margin: 0, color: 'white', fontWeight: 400 }}>{item}</p>
        </div>
      </Nav.Link>
    );
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className='containerCustom border-top border-bottom'>
        <Navbar.Brand href="#home">
          <img src={title} style={{width: 200, height:30}}/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <CustomNavBarItem item='Home'/>
            <CustomNavBarItem item='Giới thiệu'/>
            {/* <CustomDropdown title='Miền Bắc' items={regions['Miền Bắc']} />
            <CustomDropdown title='Miền Trung' items={regions['Miền Trung']} />
            <CustomDropdown title='Miền Nam' items={regions['Miền Nam']} /> */}
            <CustomNavBarItem item='Bảng giá'/>
            <CustomNavBarItem item='Đặt tour'/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;