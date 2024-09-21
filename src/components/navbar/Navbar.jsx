import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './navbarStyle.css';
import React, { useState } from 'react';

function NavbarComp() {
  const [showDropdown, setShowDropdown] = useState(null);

  function CustomDropdown({title, list}) {
    return (
      <NavDropdown show={showDropdown === title}
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

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Travel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={{ justifyContent: 'space-between', flex: 1}}>
            <Nav.Link className='navbarElement' href="#home">Home</Nav.Link>
            <CustomDropdown title='List 1' list={
              [
                {title: 'Item 1', url: '/item1'},
                {title: 'Item 2', url: '/item2'},
                {title: 'Item 3', url: '/item3'},
                {title: 'Item 4', url: '/item4'},
                {title: 'Item 5', url: '/item5'},
              ]
            }/>
            <CustomDropdown title='List 2' list={
              [
                {title: 'Item 6', url: '/item1'},
                {title: 'Item 7', url: '/item2'},
                {title: 'Item 8', url: '/item3'},
                {title: 'Item 9', url: '/item4'},
                {title: 'Item 10', url: '/item5'},
              ]
            }/>
            <CustomDropdown title='List 3' list={
              [
                {title: 'Item 11', url: '/item1'},
                {title: 'Item 12', url: '/item2'},
                {title: 'Item 13', url: '/item3'},
                {title: 'Item 14', url: '/item4'},
                {title: 'Item 15', url: '/item5'},
              ]
            }/>
            <Nav.Link className='navbarElement' href="#link">Link</Nav.Link>
            <CustomDropdown title='List 4' list={
              [
                {title: 'Item 16', url: '/item1'},
                {title: 'Item 17', url: '/item2'},
                {title: 'Item 18', url: '/item3'},
                {title: 'Item 19', url: '/item4'},
                {title: 'Item 20', url: '/item5'},
              ]
            }/>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;