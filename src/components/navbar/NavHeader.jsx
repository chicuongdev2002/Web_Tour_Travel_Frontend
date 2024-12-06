import React, { useState, useEffect, useRef } from "react";
import NavbarComp from "../navbar/Navbar";
import brand from "../../assets/logo.png";
import "../../style/style.css";
import { useNavigate } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import {
  AccountCircle,
  AdminPanelSettings,
  BarChart,
  Add,
  ListAlt,
  CalendarToday,
  Favorite,
  ExitToApp,
  CheckCircle,
  Login,
} from "@mui/icons-material";
import MenuDropDown from "../dropDown/MenuDropDown";
import { FaUserCircle } from "react-icons/fa";

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

  const goToUserDetail = () => {
    navigate("/user-detail");
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

  const goToAssignTourGuide = () => {
    navigate("/tour-guide-assiment");
    setDropdownVisible(false);
  };

  const goToCheckin = () => {
    navigate("/checkin");
    setDropdownVisible(false);
  };

  const goToScheduleTourGuide = () => {
    navigate("/schedule-tour-guide");
    setDropdownVisible(false);
  };

  const goToBookingList = () => {
    navigate("/booking-list");
  };

  const goToFavoriteTour = () => {
    navigate("/favorite-tour");
    setDropdownVisible(false);
  };

  const goToScheduleTour = () => {
    navigate("/schedule-tour-booking");
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
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
    <div
      className="d-flex divCenter pr-2"
      style={{ backgroundColor: opacity && "rgba(0, 0, 0, 0.3)" }}
    >
      <img src={brand} style={{ width: 80, height: 70 }} alt="Brand Logo" />
      <div style={{ flexGrow: 1 }} className="divRowBetween pr-2">
        <NavbarComp textColor={textColor} />
        {user ? (
          <MenuDropDown
            options={[
              {
                title: "Thông tin khách hàng",
                onClick: goToUserDetail,
                icon: <AccountCircle className="mr-2 gradient-icon" />,
              },
              user.role === "ADMIN" && {
                title: "Trang dành cho admin",
                onClick: goToAdminPage,
                icon: <AdminPanelSettings className="mr-2 gradient-icon" />,
              },
              user.role === "TOURPROVIDER" && {
                title: "Thống kê tour",
                onClick: goToTourStatistics,
                icon: <BarChart className="mr-2 gradient-icon" />,
              },
              user.role === "TOURPROVIDER" && {
                title: "Đăng bán tour",
                onClick: goToSellTour,
                icon: <Add className="mr-2 gradient-icon" />,
              },
              user.role === "TOURGUIDE" && {
                title: "Xem thông tin phân công",
                onClick: goToAssignTourGuide,
                icon: <ListAlt className="mr-2 gradient-icon" />,
              },
              user.role === "TOURGUIDE" && {
                title: "Checkin khách hàng",
                onClick: goToCheckin,
                icon: <CheckCircle className="mr-2 gradient-icon" />,
              },
              user.role === "TOURGUIDE" && {
                title: "Lịch trình HDV",
                onClick: goToScheduleTourGuide,
                icon: <CalendarToday className="mr-2 gradient-icon" />,
              },
              (user.role === "CUSTOMER" || user.role === "CUSTOMERVIP") && {
                title: "Danh sách đơn đặt tour",
                onClick: goToBookingList,
                icon: <ListAlt className="mr-2 gradient-icon" />,
              },
              {
                title: "Danh sách tour yêu thích",
                onClick: goToFavoriteTour,
                icon: <Favorite className="mr-2 gradient-icon" />,
              },
              {
                title: "Lịch trình xuất phát",
                onClick: goToScheduleTour,
                icon: <CalendarToday className="mr-2 gradient-icon" />,
              },
              {
                title: "Đăng xuất",
                onClick: handleLogout,
                icon: <ExitToApp className="mr-2 gradient-icon" />,
              },
            ]}
          >
            <div>
              <FaUserCircle className="gradient-icon" size={30} />
              <span
                className="ml-2 one-line"
                style={{ color: textColor, fontSize: 20 }}
              >
                {user.fullName}
              </span>
            </div>
          </MenuDropDown>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Login />}
            onClick={goToLogin}
            sx={{
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: "16px",
            }}
          >
            Đăng nhập
          </Button>
        )}
        <div></div>
      </div>
    </div>
  );
}

export default NavHeader;
