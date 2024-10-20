import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { FaUser, FaEye } from "react-icons/fa";
// import * as authApi from '../../functions/authApi';
import checkEmailExists from '../../functions/checkEmailExsist';
import checkAccountExists from '../../functions/checkAccount';
import sendVerificationCode from '../../functions/sendVerificationCode';
import verifyCode from '../../functions/verifyCode';
import login from '../../functions/login';
import register from '../../functions/register';
import resetPassword from '../../functions/resetPassword';
const LoginRegister = () => {
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [errorRegister, setErrorRegister] = useState("");
  const [showErrorRegister, setShowErrorRegisterr] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Trạng thái cho popup
  const [showVerify, setShowVerify] = useState(false); // Trạng thái verify
  const [popupMessage, setPopupMessage] = useState(""); // Thông điệp popup
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false); // Trạng thái kiểm tra mã xác thực
  const [countdown, setCountdown] = useState(10); // Thời gian đếm ngược
  const [showCountDown, setShowCountdown] = useState(false); // Thời gian đếm ngược
  const [accountExists, setAccountExists] = useState(false); // Trạng thái kiểm tra tài khoản
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0); //Theo dõi số lần nhập sai mật khẩu
  const [checkAccountError, setCheckAccountError] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetVerificationCode, setResetVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isResetCodeSent, setIsResetCodeSent] = useState(false);
  const [resetError, setResetError] = useState("");
  const [isResetCodeVerified, setIsResetCodeVerified] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkEmailError, setCheckEmailError] = useState("");
  const [showEmailForget, setShowMailForget] = useState(false);
   const [isForgotPasswordActive, setIsForgotPasswordActive] = useState(false);
  const [showErrorMailForget, setShowErrorMailForget] = useState("");
  const navigate = useNavigate();

  // Hàm kiểm tra email tồn tại
 const checkEmailExistsHandler = async (email) => {
    const result = await checkEmailExists(email);
    setEmailExists(result.emailExists);
    setCheckEmailError(result.checkEmailError);
    return result.emailExists;
  };

  const checkEmailNonExists = async (email) => {
    const result = await checkEmailExists(email);
    setShowMailForget(!result.emailExists);
    setShowErrorMailForget(result.emailExists ? "" : "Email không tồn tại trong hệ thống");
  };

  const checkAccountExistsHandler = async (username) => {
    const result = await checkAccountExists(username);
    setAccountExists(result.accountExists);
    setCheckAccountError(result.checkAccountError);
    return result.accountExists;
  };

  const handleRegisterClick = () => {
    setIsActive(true);
    setError("");
  };

  const handleForgetPasswordClick = () => {
    setShowEmailInput(true);
    setFailedLoginAttempts(3);
    setIsForgotPasswordActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.isLoginSuccessful) {
      console.log("Đăng nhập thành công:", result.userData);
      navigate("/");
    } else {
      if (result.loginError === "Mật khẩu không chính xác") {
        setFailedLoginAttempts((prev) => prev + 1);
        setError("Mật khẩu không chính xác");
        if (failedLoginAttempts >= 2) {
          setShowEmailInput(true);
          setError("Bạn đã nhập sai mật khẩu quá 3 lần. Xin vui lòng nhập email để nhận mã xác thực.");
        }
      } else {
        setError(result.loginError);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim() || !phoneNumber.trim() || !email.trim()) {
        setErrorRegister("Vui lòng điền đầy đủ thông tin.");
        setShowErrorRegisterr(true);
        return;
    }

    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
        setErrorRegister("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
        setShowErrorRegisterr(true);
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setErrorRegister("Email không hợp lệ.");
        setShowErrorRegisterr(true);
        return;
    }

    try {
      const accountExistsResult = await checkAccountExists(username);
      const emailExistsResult = await checkEmailExists(email);

      if (accountExistsResult.accountExists || emailExistsResult.emailExists) {
        setErrorRegister(accountExistsResult.accountExists ? accountExistsResult.checkAccountError : emailExistsResult.checkEmailError);
        setShowErrorRegisterr(true);
        return;
      }

      setShowErrorRegisterr(false);

      const sendCodeResult = await sendVerificationCode(email);
      if (sendCodeResult.isCodeSent) {
        setIsVerificationSent(true);
        setShowVerify(true);
        setCountdown(5);
        setShowCountdown(true);

        const endTime = Date.now() + 5000;
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
      } else {
        setErrorRegister(sendCodeResult.sendCodeError);
      }
    } catch (err) {
      setError(err.message);
      setPopupMessage(err.message);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    const verifyResult = await verifyCode(email, verificationCode);
    if (!verifyResult.isCodeValid) {
      setError(verifyResult.verifyCodeError);
      return;
    }

    const registerResult = await register(username, password, fullName, phoneNumber, email);
    if (registerResult.isRegisterSuccessful) {
      console.log("Đăng ký thành công", registerResult.userData);
      setPopupMessage("Đăng ký thành công!");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setIsActive(false);
      }, 3000);
    } else {
      setError(registerResult.registerError);
      setPopupMessage(registerResult.registerError);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
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
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };
    const handleLoginSuccess = async (credentialResponse) => {
    try {
      const credentialResponseDecoded = decodeJwt(credentialResponse.credential);
      console.log("Decoded Google User:", credentialResponseDecoded);

      const googleUser = {
        name: credentialResponseDecoded.name,
        email: credentialResponseDecoded.email,
        picture: credentialResponseDecoded.picture,
      };

      setUser(googleUser);
      localStorage.setItem("user", JSON.stringify(googleUser));
    } catch (error) {
      console.error("Error decoding Google credential:", error);
      setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    }
  };

  const handleLoginFailure = (response) => {
    console.log("Login Failed:", response);
  };
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    if (showEmailForget) {
      return;
    }
    const result = await sendVerificationCode(resetEmail);
    if (result.isCodeSent) {
      setIsResetCodeSent(true);
      setResetError("");
      setError("");
      setPopupMessage("Mã xác thực đã được gửi đến email của bạn.");
      setShowPopup(true);
    } else {
      setResetError(result.sendCodeError);
    }
  };

  const handleVerifyResetCode = async (e) => {
    e.preventDefault();
    const result = await verifyCode(resetEmail, resetVerificationCode);
    if (result.isCodeValid) {
      setIsResetCodeVerified(true);
      setResetError("");
      setError("");
      setPopupMessage("Mã xác thực hợp lệ. Vui lòng nhập mật khẩu mới.");
      setShowPopup(true);
    } else {
      setResetError(result.verifyCodeError);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu mới không khớp. Vui lòng nhập lại.");
      return;
    }

    const result = await resetPassword(resetEmail, newPassword);
    if (result.isResetSuccessful) {
      setPopupMessage("Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại.");
      setShowPopup(true);
      setIsActive(false);
      setShowEmailInput(false);
      setFailedLoginAttempts(0);
      setResetEmail("");
      setResetVerificationCode("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsResetCodeSent(false);
      setIsResetCodeVerified(false);
      setError("");
    } else {
      setResetError(result.resetError);
    }
  };
  return (
    <div className="divCenter">
      <div className={`wrapper ${isActive ? "active" : ""}`}>
        <span className="rotate-bg"></span>
        <span className="rotate-bg2"></span>

      {/* Login Form */}
      <div className="form-box login">
        <h2 className="title animation" style={{ "--i": 0, "--j": 21 }}>
          <button onClick={handleLogin}>Đăng nhâp</button>
        </h2>
        <form onSubmit={handleLogin}>
          {!showEmailInput && failedLoginAttempts < 3 && (
            <>
              <div
                className="input-box animation"
                style={{ "--i": 1, "--j": 22 }}
              >
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label>Tài khoản</label>
                <i className="bx bxs-user"></i>
              </div>
              <div
                className="input-box animation"
                style={{ "--i": 2, "--j": 23 }}
              >
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Mật khẩu</label>
                <i className="bx bxs-lock-alt"></i>
              </div>
            </>
          )}
          {showEmailInput && (
            <>
              <div
                className="input-box animation"
                style={{ "--i": 1, "--j": 22 }}
              >
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => {
                    checkEmailNonExists(e.target.value);
                    setResetEmail(e.target.value)}
                  }
                />
                <label>Email</label>
                  {showEmailForget && (
              <p className="error-message">{showErrorMailForget}</p>
            )}
                <i className="bx bxs-envelope"></i>
              </div>
              {isResetCodeSent && !isResetCodeVerified && (
                <div
                  className="input-box animation"
                  style={{ "--i": 2, "--j": 23 }}
                >
                  <input
                    type="text"
                    required
                    value={resetVerificationCode}
                    onChange={(e) => setResetVerificationCode(e.target.value)}
                  />
                  <label>Mã xác thực</label>
                  <i className="bx bxs-lock-alt"></i>
                </div>
              )}
              {isResetCodeVerified && (
                <>
                  <div
                    className="input-box animation"
                    style={{ "--i": 3, "--j": 24 }}
                  >
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label>Mật khẩu mới</label>
                    <i className="bx bxs-lock-alt"></i>
                  </div>
                  <div
                    className="input-box animation"
                    style={{ "--i": 4, "--j": 25 }}
                  >
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <label>Nhập lại mật khẩu</label>
                    <i className="bx bxs-lock-alt"></i>
                  </div>
                </>
              )}
            </>
          )}
          {error && <p className="error-message">{error}</p>}
          {resetError && <p className="error-message">{resetError}</p>}
          <button
            type="submit"
            className="btn animation"
            style={{ "--i": 5, "--j": 26 }}
            onClick={
              showEmailInput
                ? isResetCodeSent
                  ? isResetCodeVerified
                    ? handleResetPassword
                    : handleVerifyResetCode
                  : handleSendResetCode
                : handleLogin
            }
          >
            {showEmailInput
              ? isResetCodeSent
                ? isResetCodeVerified
                  ? "Đặt lại mật khẩu"
                  : "Xác minh mã"
                : "Gửi mã xác minh"
              : "Đăng nhập"}
          </button>
          <div className="linkTxt animation" style={{ "--i": 5, "--j": 25 }}>
            <p>
              Bạn chưa có tài khoản?{" "}
              <a
                href="#"
                className="register-link"
                onClick={handleRegisterClick}
              >
                Đăng kí
              </a>
            </p>
              {!isForgotPasswordActive && (
            <p>
              <a
                href="#"
                className="register-link"
                onClick={handleForgetPasswordClick}
              >
                Bạn quên mật khẩu ư?
              </a>
            </p>
          )}
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
          Đăng kí
        </h2>
        <form onSubmit={handleRegister}>
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                // checkAccountExists(e.target.value); // Gọi hàm kiểm tra tài khoản
              }}
            />
            <label>Tài khoản</label>
            {/* Hiển thị thông báo lỗi nếu có */}
            {checkAccountError && (
              <p className="error-message">{checkAccountError}</p>
            )}
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 20, "--j": 3 }}>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Mật khẩu</label>
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <label>Họ và tên</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhone(e.target.value)}
              pattern="[0-9]{10,}"
              // placeholder="Số điện thoại"
            />
            <label>Số điện thoại</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                // checkEmailExists(e.target.value);
                setEmail(e.target.value)}}
            />
            <label>Email</label>
              {/* {checkEmailError && (
              <p className="error-message">{checkEmailError}</p>
            )} */}
            <i className="bx bxs-user"></i>
          </div>
          {showErrorRegister && <p className="error-message">{errorRegister}</p>}
          {/* Trường nhập mã xác thực */}
          {showVerify && (
            <div
              className="input-box animation"
              style={{ "--i": 18, "--j": 1 }}
            >
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
            onClick={
              isVerificationSent ? handleVerifyAndRegister : handleRegister
            }
          >
            {isVerificationSent ? "Xác thực và Đăng ký" : "Gửi mã xác thực"}
          </button>
          <div className="linkTxt animation" style={{ "--i": 22, "--j": 5 }}>
            <p>
              Đã có tài khoản?{" "}
              <a
                href="#"
                className="login-link"
                onClick={() => setIsActive(false)}
              >
                Đăng nhập
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
