import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const location = useLocation();

  if (!user) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login-register" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute;