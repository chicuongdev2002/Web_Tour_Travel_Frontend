import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const LoginRegister = () => {
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Trạng thái cho popup
  const [showVerify, setShowVerify] = useState(false); // Trạng thái cho popup
  const [popupMessage, setPopupMessage] = useState(""); // Thông điệp popup
  const [verificationCode, setVerificationCode] = useState(""); 
  const [isVerificationSent, setIsVerificationSent] = useState(false); // Trạng thái kiểm tra mã xác thực
  const [countdown, setCountdown] = useState(10); // Thời gian đếm ngược
  const [showCountDown, setShowCountdown] = useState(false); // Thời gian đếm ngược
  const [accountExists, setAccountExists] = useState(false); // Trạng thái kiểm tra tài khoản
  const [checkAccountError, setCheckAccountError] = useState("");
  const navigate = useNavigate();
  // Hàm kiểm tra tài khoản tồn tại
// Hàm kiểm tra tài khoản tồn tại
const checkAccountExists = async (username) => {
  if (!username) {
    setAccountExists(false);
    setCheckAccountError("");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/accounts/exists/${username}`);
    if (!response.ok) {
      throw new Error("Không thể kiểm tra tài khoản.");
    }
    const exists = await response.json();
    setAccountExists(exists);
    setCheckAccountError(exists ? "Tài khoản đã tồn tại." : ""); // Hiển thị thông báo nếu tài khoản tồn tại
  } catch (error) {
    setCheckAccountError(error.message);
  }
};
  // Hàm thay đổi trạng thái đăng kí
  const handleRegisterClick = () => {
    setIsActive(true);
  };
  // Hàm thay đổi trạng thái đăng nhập
  const handleLoginClick = () => {
    setIsActive(false);
  };
  //  Hàm đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/api/accounts/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({ username, password }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message); // Lấy thông báo lỗi từ phản hồi
      }

      const data = await response.json();
      console.log("Đăng nhập thành công:", data);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };
 // Hàm gửi mã xác thực email
  const sendVerificationCode = async (email) => {
    const response = await fetch("http://localhost:8080/api/verification/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return response.ok;
  };

  // Hàm xác thực mã xác thực
  const verifyCode = async (code) => {
    const response = await fetch("http://localhost:8080/api/verification/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    return response.ok;
  };

  // Hàm đăng ký tài khoản
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
       // Kiểm tra xem tài khoản đã tồn tại hay chưa
     await checkAccountExists(username);
     if (accountExists) {
      throw new Error("Tài khoản đã tồn tại. Vui lòng chọn tên tài khoản khác.");
    }
      // Gửi mã xác thực đến email
      const isCodeSent = await sendVerificationCode(email);
      if (!isCodeSent) {
        throw new Error("Không thể gửi mã xác thực đến email. Vui lòng kiểm tra lại.");
      }

      setIsVerificationSent(true);
      setShowVerify(true); // Hiển thị trường nhập mã xác thực
      setCountdown(5); // Đặt thời gian đếm ngược
      setShowCountdown(true); // Hiển thị thời gian đếm ngược
      // Bắt đầu đếm ngược
      const endTime = Date.now() + countdown * 1000; // Thời gian kết thúc
      const countdownInterval = setInterval(() => {
        const remainingTime = Math.ceil((endTime - Date.now()) / 1000);
        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
          setPopupMessage("Mã xác thực đã được gửi đến email của bạn.");
          setShowPopup(true);
          setCountdown(0);
          setShowCountdown(false);
        } else {
          setCountdown(remainingTime);
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
      setPopupMessage(err.message);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  // Hàm gửi thông tin đăng ký sau khi xác thực mã
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    try {
      // Xác thực mã xác thực
      const isCodeValid = await verifyCode(verificationCode);
      if (!isCodeValid) {
        throw new Error("Mã xác thực không hợp lệ. Vui lòng kiểm tra lại.");
      }
      console.log("Mã xác thực hợp lệ",isCodeValid);
      // Nếu mã xác thực hợp lệ, tiến hành đăng ký tài khoản
      const response = await fetch(
        `http://localhost:8080/api/accounts/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, phone, email }),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          errorMessage = data.message;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }
      console.log("Đăng ký thành công",response);
      setPopupMessage("Đăng ký thành công!");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setIsActive(false);
      }, 3000);
    } catch (err) {
      setError(err.message);
      setPopupMessage(err.message);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  const handleSwitchToLogin = () => {
    setSuccessMessage("");
  };
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };
  // Hàm login success với google
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      // const jwtDecode = (await import('jwt-decode')).default;
      const credentialResponseDecoded = decodeJwt(
        credentialResponse.credential,
      );
      console.log("Decoded Google User:", credentialResponseDecoded);

      const googleUser = {
        name: credentialResponseDecoded.name,
        email: credentialResponseDecoded.email,
        picture: credentialResponseDecoded.picture,
      };

      setUser(googleUser);
      localStorage.setItem("user", JSON.stringify(googleUser));
      // navigate('/home');
    } catch (error) {
      console.error("Error decoding Google credential:", error);
      setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    }
  };
  // Hàm login faild google
  const handleLoginFailure = (response) => {
    console.log("Login Failed:", response);
  };
  return (
    <div className="divCenter">
      <div className={`wrapper ${isActive ? "active" : ""}`}>
      <span className="rotate-bg"></span>
      <span className="rotate-bg2"></span>

      {/* Login Form */}
      <div className="form-box login">
        <h2 className="title animation" style={{ "--i": 0, "--j": 21 }}>
          <button onClick={handleSwitchToLogin}>Login</button>
        </h2>
        <form onSubmit={handleLogin}>
          <div className="input-box animation" style={{ "--i": 1, "--j": 22 }}>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Username</label>
            {/* <i className="bx bxs-user"></i> */}
          </div>
          <div className="input-box animation" style={{ "--i": 2, "--j": 23 }}>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
            {/* <i className="bx bxs-lock-alt"></i> */}
          </div>
          <button
            type="submit"
            className="btn animation"
            style={{ "--i": 3, "--j": 24 }}
          >
            Login
          </button>
          {/* {error && <p className="error-message">{error}</p>} */}
          <div className="linkTxt animation" style={{ "--i": 5, "--j": 25 }}>
            <p>
              Don't have an account?{" "}
              <a
                href="#"
                className="register-link"
                onClick={handleRegisterClick}
              >
                Sign Up
              </a>
            </p>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
            />
          </div>
        </form>
      </div>

      {/* Info Text for Login */}
      <div className="info-text login">
        <h2 className="animation" style={{ "--i": 0, "--j": 20 }}>
          Xuyên Việt Tour
        </h2>
        <p className="animation" style={{ "--i": 1, "--j": 21 }}>
          Welcome Back!
        </p>
      </div>
      {/* Register Form */}
      <div className="form-box register">
        <h2 className="title animation" style={{ "--i": 17, "--j": 0 }}>
          Sign Up
        </h2>
        <form onSubmit={handleRegister}>
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                checkAccountExists(e.target.value); // Gọi hàm kiểm tra tài khoản
              }}
            />
            <label>Username</label>
              {/* Hiển thị thông báo lỗi nếu có */}
             {checkAccountError && <p className="error-message">{checkAccountError}</p>}
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 20, "--j": 3 }}>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <label>FullName</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input
              type="tel" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="[0-9]{10,}"
              placeholder="Phone"
            />
            <label>Phone</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
            <i className="bx bxs-user"></i>
          </div>
          {/* Trường nhập mã xác thực */}
          {showVerify && (
            <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Nhập mã xác thực"
              />
              <label>Mã xác thực</label>
              {showCountDown && <p>Thời gian còn lại: {countdown} giây</p>}
              <i className="bx bxs-user"></i>
            </div>
          
          )}
          <button
            type="submit"
            className="btn animation"
            style={{ "--i": 21, "--j": 4 }}
            onClick={isVerificationSent  ? handleVerifyAndRegister : handleRegister}
          >
            {isVerificationSent  ? "Xác thực và Đăng ký" : "Gửi mã xác thực"}
          </button>
          <div className="linkTxt animation" style={{ "--i": 22, "--j": 5 }}>
            <p>
              Already have an account?{" "}
              <a href="#" className="login-link" onClick={() => setIsActive(false)}>
                Login
              </a>
            </p>
          </div>
        </form>
        {/* Popup thông báo */}
        {showPopup && (
          <div className="popup">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>Đóng</button>
          </div>
        )}
      </div>

      {/* Info Text for Register */}
      <div className="info-text register">
        <h2 className="animation" style={{ "--i": 17, "--j": 0 }}>
          Welcome Back!
        </h2>
        <p className="animation" style={{ "--i": 18, "--j": 1 }}>
          Enter your personal details and start journey with us
        </p>
      </div>
    </div>
    </div>
  );
};

export default LoginRegister;
