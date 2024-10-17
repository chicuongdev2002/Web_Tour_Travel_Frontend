import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './navbarStyle.css';
import React, { useState } from 'react';
import brand from '../../assets/logo.png';
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

  return (
    <Navbar expand="lg" className="bg-light shadow-sm">
      <Container>
        <Navbar.Brand href="#home" className="brand-title">
            <img src={brand} alt="Brand Logo" style={{ width: 100, height: 100 }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Trang Chủ</Nav.Link>
            <CustomDropdown title='Miền Bắc' items={regions['Miền Bắc']} />
            <CustomDropdown title='Miền Trung' items={regions['Miền Trung']} />
            <CustomDropdown title='Miền Nam' items={regions['Miền Nam']} />
            <Nav.Link href="#price">Bảng Giá</Nav.Link>
            <Nav.Link href="#contact">Liên Hệ</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;