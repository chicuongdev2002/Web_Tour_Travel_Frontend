import React, { useState, useEffect, useRef } from "react";
import NavbarComp from "../navbar/Navbar";
import brand from "../../assets/logo.png";
import "../../style/style.css";
import { useNavigate } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import { toast } from 'react-toastify';
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
import ApartmentIcon from '@mui/icons-material/Apartment';
import { decodeJwt } from "../../functions/jwtDecoder";
import refreshToken from "../../functions/refeshtoken";
import logout from "../../functions/logout";
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
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const accessToken = sessionStorage.getItem("accessToken");
      
  //     if (accessToken) {
  //       try {
  //         const decodedUser = decodeJwt(accessToken);
  //         sessionStorage.setItem("user", JSON.stringify(decodedUser));
  //         setUser(decodedUser);
  //       } catch (error) {
  //         console.error("Token không hợp lệ", error);
  //       }
  //     } else {
  //       try {
  //         const newAccessToken = await refreshToken();
  //         sessionStorage.setItem("accessToken", JSON.stringify(newAccessToken));
  //         const decodedUser = decodeJwt(newAccessToken);
  //         sessionStorage.setItem("user", JSON.stringify(decodedUser));
  //         setUser(decodedUser);
  //       } catch (error) {
  //         console.error("Không thể làm mới token:", error);
  //       }
  //     }
  //   };

  //   fetchUserData(); 
  // }, []);
useEffect(() => {
  const storedUser = sessionStorage.getItem("user");
  console.log("Stored user:", storedUser);
  
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed user:", parsedUser);
      console.log("User active status:", parsedUser.active);

      if (parsedUser&&!parsedUser.active) {
        toast.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error parsing user:", error);
    }
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
  const goToTourManager = () => {
    navigate("/provider-manager");
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

const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      sessionStorage.clear();
      setUser(null);
      navigate("/");
    }
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
                title: "Quản lý tour",
                onClick: goToTourManager,
                icon: <ApartmentIcon className="mr-2 gradient-icon" />,
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
