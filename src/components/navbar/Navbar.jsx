import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./navbarStyle.css";
import title from "../../assets/title.png";
import React, { useState } from "react";
import { useNavigate } from "react-router";
function NavbarComp({ textColor }) {
  const [showDropdown, setShowDropdown] = useState(null);
  const navigate = useNavigate();
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
          <NavDropdown.Item
            key={index}
            href={`#${item}`}
            className="dropdown-item"
          >
            {item}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    );
  }

  function CustomNavBarItem({ item, onClick }) {
    return (
      <Nav.Link className="navbarElement">
        <div className="divCenter" onClick={onClick}
        >
          <p className="text-link"
            style={{
              fontSize: 25,
              margin: 0,
              color: textColor ? textColor : "white",
              fontWeight: 700,
            }}
          >
            {item}
          </p>
        </div>
      </Nav.Link>
    );
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className="containerCustom border-top border-bottom d-flex">
        <Navbar.Brand href="/">
          <img src={title} style={{ width: 200, height: 60 }} />
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav" style={{ flexGrow: 1 }}>
          <Nav className="me-auto divRowBetween w-100">
            <CustomNavBarItem item="Home" onClick={() => navigate("/")} />
            <CustomNavBarItem item="Giới thiệu" />
            {/* <CustomNavBarItem
              item="Danh sách đặt tour"
              onClick={() => navigate("/booking-list")}
            /> */}
            <CustomNavBarItem
              item="Danh sách phân công tour"
              onClick={() => navigate("/tour-guide-details")}
            />
            <CustomNavBarItem item="Đặt tour" 
              onClick={() => navigate("/tour-list")}
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;
