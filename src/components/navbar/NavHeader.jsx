import React, { useState, useEffect, useRef } from "react";
import NavbarComp from "../navbar/Navbar";
import brand from "../../assets/logo.png";
import "../../style/style.css";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import MenuDropDown from "../dropDown/MenuDropDown";

function NavHeader({ textColor, opacity }) {
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
   const goToCheckin = () => {
    navigate("/checkin");
    setDropdownVisible(false); 
  };

  const goToAdminPage = () => {
    navigate("/admin");
  };

  const goToTourStatistics = () => {
    navigate("/provider-detail"); 
    setDropdownVisible(false); 
  };
    const goToSellTour = () => {
    navigate("/add-tour"); 
    setDropdownVisible(false); 
  };
    const goToFavoriteTour = () => {
    navigate("/favorite-tour"); 
    setDropdownVisible(false); 
  };
     const goToScheduleTour = () => {
    navigate("/schedule-tour-booking"); 
    setDropdownVisible(false); 
  };

  const goToBookingList = () => {
    navigate("/booking-list");
  }


  const handleLogout = () => {
    sessionStorage.removeItem("user"); 
    setUser(null); 
    // setDropdownVisible(false); 
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
    <div className="d-flex divCenter pr-2" style={{ backgroundColor: opacity && "rgb(0, 0, 0, 0.3)" }}>
      <img src={brand} style={{ width: 80, height: 70 }} alt="Brand Logo" />
      <div style={{ flexGrow: 1 }} className="divRowBetween pr-2">
        <NavbarComp textColor={textColor} />
          {user ? (
          <MenuDropDown options={[
            { title: "Thông tin khách hàng", onClick: goToUserDetail },
                user && user.role === "ADMIN" && 
              { title: "Trang dành cho admin",
                onClick: goToAdminPage
              },
               user && user.role === "TOURPROVIDER" && 
              { title: "Thống kê tour",
                onClick: goToTourStatistics
              },
              user && user.role === "TOURPROVIDER" && 
              { title: "Đăng bán tour",
                onClick: goToSellTour
              },
               user && user.role === "TOURGUIDE" && 
              { title: "Xem thông tin phân công",
                onClick: goToAssignTourGuide
              },
               user && user.role === "TOURGUIDE" && 
              { title: "Checkin khách hàng",
                onClick: goToCheckin
              },
              user && (user.role === "CUSTOMER" || user.role==="CUSTOMERVIP")&&
              { title: "Danh sách đơn đặt tour",
                onClick: goToBookingList
              },
            { title: "Danh sách tour yêu thích", onClick: goToFavoriteTour },
             { title: "Lịch trình tour", onClick: goToScheduleTour },
            { title: "Đăng xuất", onClick: handleLogout }
           
          ]}>
            <div>
              <FaUserCircle color={textColor} size={30} />
              <span className="ml-2 one-line" style={{ color: textColor, fontSize: 20 }} >
                {user.fullName}
              </span>
            </div>
          </MenuDropDown>
          ) : (
            <button className="ml-2 bg-primary" onClick={goToLogin}>
              Login
            </button>
          )}
          <div>
          </div>
        </div>
      </div>
  );
}

export default NavHeader;