import React, { useState, useEffect, useRef } from "react";
import NavbarComp from "../navbar/Navbar";
import brand from "../../assets/logo.png";
import "../../style/style.css";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import MenuDropDown from "../dropDown/MenuDropDown";

function NavHeader({ textColor, opacity }) {
  const [user, setUser] = useState(null);
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

  const goToUserDetail = () => {
    navigate("/user-detail");
  };

  const goToAdminPage = () => {
    navigate("/admin");
  }

  const handleLogout = () => {
    sessionStorage.removeItem("user"); // Clear user data
    setUser(null); // Reset user state
    navigate("/"); // Optionally navigate to home
  };

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
            { title: "Đăng xuất", onClick: handleLogout }
          ]}>
            <div>
              <FaUserCircle color={textColor} size={30} />
              <span className="ml-2" style={{ color: textColor, fontSize: 20 }} >
                {user.fullName}
              </span>
            </div>
          </MenuDropDown>
          ) : (
            <button className="ml-2 bg-primary" onClick={goToLogin}>
              Login
            </button>
          )}
      </div>
    </div>
  );
}

export default NavHeader;
