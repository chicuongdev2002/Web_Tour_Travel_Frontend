import React, { useState, useEffect, useRef } from "react";
import NavbarComp from "../navbar/Navbar";
import brand from "../../assets/logo.png";
import "../../style/style.css";
import { useNavigate } from "react-router-dom";

function NavHeader({ textColor }) {
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    startLocation: "",
    tourType: "",
    participantType: "",
  });
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const goToLogin = () => {
    navigate("/login-register");
  };

  const goToTourList = () => {
    navigate("/tour-list", { state: searchParams }); 
  };

  const goToUserDetail = () => {
    navigate("/user-detail");
    setDropdownVisible(false); 
  };
    const goToAssignTourGuide = () => {
    navigate("/tour-guide-assiment");
    setDropdownVisible(false); 
  };

  const goToAdminPage = () => {
    navigate("/admin");
  };

  const goToTourStatistics = () => {
    navigate("/provider-detail"); 
    setDropdownVisible(false); 
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user"); 
    setUser(null); 
    setDropdownVisible(false); 
    navigate("/"); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="d-flex divCenter pr-2">
      <img src={brand} style={{ width: 80, height: 70 }} alt="Brand Logo" />
      <div style={{ flexGrow: 1 }} className="divRowBetween pr-2">
        <NavbarComp textColor={textColor} />
        <div className="divRowBetween">
          {user ? (
            <div className="dropdown" ref={dropdownRef}>
              <span className="ml-2" onClick={toggleDropdown}>
                Xin chào, {user.fullName}
              </span>
              {dropdownVisible && (
                <div className="dropdown-menu" style={{ display: "block" }}>
                  <div className="dropdown-item" onClick={goToUserDetail}>
                    Thông tin khách hàng
                  </div>
                   {user.role === "ADMIN" && (
                    <div className="dropdown-item" onClick={goToAdminPage}>
                      Quản trị viên tour
                    </div>
                  )}
                  {user.role === "TOURPROVIDER" && ( 
                    <div className="dropdown-item" onClick={goToTourStatistics}>
                      Thống kê tour
                    </div>
                  )}
                  {user.role === "TOURGUIDE" && (
                    <div className="dropdown-item" onClick={goToAssignTourGuide}>
                      Xem thông tin phân công
                    </div>
                  )}
                  <div className="dropdown-item" onClick={handleLogout}>
                    Đăng xuất
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="ml-2 bg-primary" onClick={goToLogin}>
              Login
            </button>
          )}
          <div>
            <button
              className="ml-2 w-100 mb-1 bg-success"
              onClick={goToTourList}
            >
              Tour List
            </button>
            {/* {user && user.role === "ADMIN" && (
              <button
                className="ml-2 w-100 mt-1 bg-dark"
                onClick={goToAdminPage}
              >
                Admin Page
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavHeader;