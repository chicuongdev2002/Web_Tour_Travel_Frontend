import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './navbarStyle.css';
import '../../style/style.css';
import React, { useState } from 'react';

function NavbarComp() {
  const [showDropdown, setShowDropdown] = useState(null);

  function CustomDropdown({ title, list }) {
    return (
      <NavDropdown show={showDropdown === title} style={{ width: 120, fontSize: 25 }}
        onMouseEnter={() => setShowDropdown(title)}
        onMouseLeave={() => setShowDropdown(null)}
        className="custom-dropdown navbarElement" title={title}>
        {
          list.map((item, index) => (
            <NavDropdown.Item key={index} href={item.url}>{item.title}</NavDropdown.Item>
          ))
        }
      </NavDropdown>
    );
  }

  function CustomNavBarItem({item}){
    return (
      <Nav.Link className='navbarElement' href="#home">
        <div className='divCenter' style={{ width: 120 }}>
          <p className='divCenter' style={{ fontSize: 25, margin: 0, color: 'black' }}>{item}</p>
        </div>
      </Nav.Link>
    );
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container style={{ margin: 0}}>
        <Navbar.Brand href="#home">
          <p>Tour Xuyên Việt</p>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <CustomNavBarItem item='Home'/>
            <CustomNavBarItem item='Giới thiệu'/>
            <CustomDropdown title='Tour' list={
              [
                { title: 'Miền Bắc', url: '/item1' },
                { title: 'Miền Trung', url: '/item2' },
                { title: 'Miền Nam', url: '/item3' },
              ]
            } />
            <CustomNavBarItem item='Bảng giá'/>
            <CustomNavBarItem item='Đặt tour'/>
            <CustomNavBarItem item='Hình ảnh'/>
            <CustomNavBarItem item='Liên hệ'/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;