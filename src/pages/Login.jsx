import React from "react";
import image from "../components/login_register/bg_tour.jpg";
import LoginRegister from "../components/login_register/LoginRegister";

function Login() {
  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
      }}
    >
      <LoginRegister />
    </div>
  );
}

export default Login;
