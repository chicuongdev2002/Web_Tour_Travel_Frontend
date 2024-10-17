import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { FaUser, FaEye } from "react-icons/fa";
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
const checkEmailExists = async (email) => {
  if (!email) {
     setEmailExists(false);
    setCheckEmailError("");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/users/exists/${email}`,
    );
    if (!response.ok) {
      setShowErrorRegisterr(true);
      setErrorRegister("Không thể kiểm tra email.");
    }
    const exists = await response.json();
    setEmailExists(exists);
    setCheckEmailError(exists ? "Email đã tồn tại." : "");
  } catch (error) {
    setCheckEmailError(error.message);
  }
};
// Hàm kiểm tra email không tồn tại
const checkEmailNonExists = async (email) => {
  if (!email) {
    setShowMailForget(false);
    setShowErrorMailForget("");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/users/exists/${email}`,
    );
    if (!response.ok) {
      setShowMailForget(true);
      setShowErrorMailForget("Không thể kiểm tra email.");
    }
    const exists = await response.json();
    console.log("Email tồn tại:", exists);
    if(!exists){
    setShowMailForget(true);
    setShowErrorMailForget("Email không tồn tại trong hệ thống");
    }else{
    setShowMailForget(false);
    setShowErrorMailForget("");
    }
  } catch (error) {
    setShowErrorMailForget(error.message);
  }
};
  // Hàm kiểm tra tài khoản tồn tại
  const checkAccountExists = async (username) => {
    if (!username) {
      setAccountExists(false);
      setCheckAccountError("");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/accounts/exists/${username}`,
      );
      if (!response.ok) {
        setError("Không thể kiểm tra tài khoản.");
      }
      const exists = await response.json();
      setAccountExists(exists);
      setCheckAccountError(exists ? "Tài khoản đã tồn tại." : "");
    } catch (error) {
      setCheckAccountError(error.message);
    }
  };
  // Hàm thay đổi trạng thái đăng kí
  const handleRegisterClick = () => {
    setIsActive(true);
    setError("");
  };
   const handleForgetPasswordClick = () => {
    setShowEmailInput(true);
    setFailedLoginAttempts(3);
    setIsForgotPasswordActive(true);
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
        },
      );
      //  if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message);
      // }
      if (response.status === 401) {
        setFailedLoginAttempts((prev) => prev + 1);
        setError("Mật khẩu không chính xác");
        if (failedLoginAttempts >= 2) {
          setShowEmailInput(true);
          setError(
            "Bạn đã nhập sai mật khẩu quá 3 lần. Xin vui lòng nhập email để nhận mã xác thực.",
          );
          return;
        }
      } 
       else if (response.status === 404) {
        setError("Tài khoản không tồn tại");
          return;
      }else if (response.ok) {
        // Reset số lần thất bại khi đăng nhập thành công
        setFailedLoginAttempts(0);
        const data = await response.json();
        console.log("Đăng nhập thành công:", data);
        navigate("/home");
      } else {
        setError("Đã xảy ra lỗi vui long thử lại");
      }
    } catch (err) {
      setError(err.message);
    }
  };
  // Hàm gửi mã xác thực email
  // Hàm gửi mã xác thực email
  const sendVerificationCode = async (email) => {
    const response = await fetch(
      "http://localhost:8080/api/verification/send-code",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    return response.ok;
  };
  // Hàm xác thực mã xác thực
  const verifyCode = async (code) => {
    const response = await fetch(
      "http://localhost:8080/api/verification/verify-code",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      },
    );
    return response.ok;
  };
  // Hàm đăng ký tài khoản
  const handleRegister = async (e) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc
  if (!fullName.trim()) {
  
    setErrorRegister("Họ và tên không được bỏ trống.");
    setShowErrorRegisterr(true);
    return;
  }
  if (!phoneNumber.trim()) {
    setErrorRegister("Số điện thoại không được bỏ trống.");
    setShowErrorRegisterr(true);
    return;
  }
  if (!email.trim()) {
    setErrorRegister("Email không được bỏ trống.");
     setShowErrorRegisterr(true);
    return;
  }
    // Kiểm tra định dạng số điện thoại
  const phoneRegex = /^[0-9]{10,}$/; // Chỉ cho phép số, ít nhất 10 chữ số
  if (!phoneRegex.test(phoneNumber)) {
    setErrorRegister("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
     setShowErrorRegisterr(true);
    return;
  }
  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setErrorRegister("Email không hợp lệ.");
    setShowErrorRegisterr(true);
    return;
  }
    try {
      // Kiểm tra xem tài khoản đã tồn tại hay chưa
      await checkAccountExists(username);
      if (accountExists) {
        setErrorRegister(
          "Tài khoản đã tồn tại không thể gửi form",
        );
          setShowErrorRegisterr(true);
      }
      await checkEmailExists(email);
      if (emailExists) {
       setErrorRegister(
          "Email đã tồn tại không thể gửi form",
        );
          setShowErrorRegisterr(true);
      }
      // Gửi mã xác thực đến email
      const isCodeSent = await sendVerificationCode(email);
      if (!isCodeSent) {
        setErrorRegister(
          "Không thể gửi mã xác thực đến email",
        );
       
      }

      setIsVerificationSent(true);
      setShowErrorRegisterr(false);
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
      console.log("Mã xác thực hợp lệ", isCodeValid);
      // Nếu mã xác thực hợp lệ, tiến hành đăng ký tài khoản
      const response = await fetch(
        `http://localhost:8080/api/accounts/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, phoneNumber, email }),
        },
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
      console.log("Đăng ký thành công", response);
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
  // Hàm gửi yêu cầu mã xác thực để đặt lại mật khẩu
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    if(showEmailForget){
    return;
    }
    try {
      const response = await fetch(
        "http://localhost:8080/api/verification/send-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        },
      );

      if (!response.ok) {
        setError("Không thể gửi mã xác thực. Vui lòng thử lại.");
      }

      setIsResetCodeSent(true);
      setResetError("");
      setError("");
      setPopupMessage("Mã xác thực đã được gửi đến email của bạn.");
      setShowPopup(true);
    } catch (err) {
      setResetError(err.message);
    }
  };

  // Hàm xác thực mã
  const handleVerifyResetCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/verification/verify-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: resetEmail,
            code: resetVerificationCode,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Mã xác thực không hợp lệ. Vui lòng thử lại.");
      }

      setIsResetCodeVerified(true);
      setResetError("");
      setError("");
      setPopupMessage("Mã xác thực hợp lệ. Vui lòng nhập mật khẩu mới.");
      setShowPopup(true);
    } catch (err) {
      setResetError(err.message);
    }
  };

  // Hàm đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmNewPassword) {
        setError("Mật khẩu mới không khớp. Vui lòng nhập lại.");
      }

      const params = new URLSearchParams({
        email: resetEmail,
        newPassword: newPassword,
      });

      const response = await fetch(
        `http://localhost:8080/api/accounts/reset-password?${params.toString()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 204) {
        setPopupMessage(
          "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại.",
        );
        setShowPopup(true);
        setIsActive(false); // Chuyển về form đăng nhập
        setShowEmailInput(false);
        setFailedLoginAttempts(0);
        // Reset các state liên quan đến việc đặt lại mật khẩu
        setResetEmail("");
        setResetVerificationCode("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsResetCodeSent(false);
        setIsResetCodeVerified(false);
        setError("");
      } else {
        setError("Đã xảy ra lỗi vui long thử lại");
      }
    } catch (err) {
      setResetError(err.message);
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
          <button onClick={handleSwitchToLogin}>Đăng nhâp</button>
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
                checkAccountExists(e.target.value); // Gọi hàm kiểm tra tài khoản
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
                checkEmailExists(e.target.value);
                setEmail(e.target.value)}}
            />
            <label>Email</label>
              {checkEmailError && (
              <p className="error-message">{checkEmailError}</p>
            )}
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
