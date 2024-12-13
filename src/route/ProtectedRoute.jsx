import React, {useState,useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { decodeJwt } from '../functions/jwtDecoder';
import refreshToken from '../functions/refeshtoken';
import login from '../functions/login';
import { toast } from 'react-toastify';
const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const [user,setUser]=useState(JSON.parse(sessionStorage.getItem("user")));
  // const location = useLocation();
  //   useEffect(() => {
  //   const fetchUserData = async () => {
  //     const accessToken = sessionStorage.getItem("accessToken");
  //     if (accessToken) {
  //       try {
  //         const decodedUser = decodeJwt(accessToken);
  //         sessionStorage.setItem("user", JSON.stringify(decodedUser));
  //         setUser(decodedUser);
  //       } catch (error) {
  //         setUser(null);
  //       }
  //     } else {
  //       try {
  //         const newAccessToken = await refreshToken();
          
  //         sessionStorage.setItem("accessToken",newAccessToken);
  //         const decodedUser = decodeJwt(newAccessToken);
  //         sessionStorage.setItem("user", JSON.stringify(decodedUser));
  //         setUser(decodedUser);
  //       } catch (error) {
  //         setUser(null);
  //       }
  //     }
  //   };

  //   fetchUserData(); 
  // }, []);
  if (!user) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login-register" state={{ from: location }} replace />;
  }
//  if (!user.active) {
//     toast.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.', {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//     sessionStorage.removeItem("user");
//     sessionStorage.removeItem("accessToken");

//     return <Navigate to="/login-register" state={{ 
//       from: location,
//       accountLocked: true
//     }} replace />;
//   }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute;