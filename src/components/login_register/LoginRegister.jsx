import React, { useState } from "react";
import "./style.css";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import checkEmailExists from "../../functions/checkEmailExsist";
import checkAccountExists from "../../functions/checkAccount";
import sendVerificationCode from "../../functions/sendVerificationCode";
import verifyCode from "../../functions/verifyCode";
import login from "../../functions/login";
import register from "../../functions/register";
import getEmailFromUsername from "../../functions/getMail";
import resetPassword from "../../functions/resetPassword";
import InputPassword from "../inputText/InputPassword";
import InputText from "../inputText/InputText";
import PersonIcon from "@mui/icons-material/Person";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EmailIcon from "@mui/icons-material/Email";
const LoginRegister = () => {
  const location = useLocation();
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
  const [showEmailForget, setShowMailForget] = useState(false);
  const [isForgotPasswordActive, setIsForgotPasswordActive] = useState(false);
  const [showErrorMailForget, setShowErrorMailForget] = useState("");
  const [resetIdentifier, setResetIdentifier] = useState(""); // email hoặc username
  const [isUsername, setIsUsername] = useState(false); // kiểm tra input là username hay email
  const [userEmail, setUserEmail] = useState(""); // email lấy được từ username
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    setIsActive(true);
    setError("");
  };

  const handleForgetPasswordClick = () => {
    setShowEmailInput(true);
    setFailedLoginAttempts(3);
    setIsForgotPasswordActive(true);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    console.log(result);
    if (result.isLoginSuccessful) {
      console.log("Đăng nhập thành công:", result.userData);
      sessionStorage.setItem("user", JSON.stringify(result.userData));
      if(location.state) 
        navigate("/booking", { state: location.state });
      else
        navigate("/");
    } else {
      if (!result.isLoginSuccessful) {
        setFailedLoginAttempts((prev) => prev + 1);
        setError(result.loginError);
        if (failedLoginAttempts >= 2) {
          setShowEmailInput(true);
          setError(
            "Bạn đã nhập sai mật khẩu quá 3 lần. Xin vui lòng nhập email để nhận mã xác thực.",
          );
        }
      } else {
        setError(result.loginError);
        console.log(result);
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
        setErrorRegister(
          accountExistsResult.accountExists
            ? accountExistsResult.checkAccountError
            : emailExistsResult.checkEmailError,
        );
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

    const registerResult = await register(
      username,
      password,
      fullName,
      phoneNumber,
      email,
    );
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
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };
  const handleLoginSuccess = async (credentialResponse) => {
    try {
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
    } catch (error) {
      console.error("Error decoding Google credential:", error);
      setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    }
  };

  const handleLoginFailure = (response) => {
    console.log("Login Failed:", response);
  };
  // Hàm kiểm tra định dạng email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    if (showEmailForget) {
      return;
    }

    try {
      let emailToVerify = resetIdentifier;

      if (isUsername) {
        // Nếu là username, lấy email từ API
        try {
          emailToVerify = await getEmailFromUsername(resetIdentifier);
          console.log("emailToVerify", emailToVerify);
          console.log("Email tìm được:", emailToVerify.email);
          setUserEmail(emailToVerify.email);
        } catch (error) {
          setResetError("Không tìm thấy email với tên đăng nhập này");
          return;
        }
      } else {
        // Nếu là email, kiểm tra tồn tại
        const emailCheck = await checkEmailExists(resetIdentifier);
        if (!emailCheck.emailExists) {
          setShowMailForget(true);
          setShowErrorMailForget("Email không tồn tại trong hệ thống");
          return;
        }
      }
      // Gửi mã xác thực
      const result = await sendVerificationCode(emailToVerify.email);
      if (result.isCodeSent) {
        setIsResetCodeSent(true);
        setResetError("");
        setError("");
        const maskedEmail = emailToVerify.email.replace(
          /(\w{3})[\w.-]+@([\w.]+)/g,
          "$1***@$2",
        );
        setPopupMessage(
          `Mã xác thực đã được gửi đến email ${maskedEmail} của bạn.`,
        );
        setShowPopup(true);
        setResetEmail(emailToVerify.email);
      } else {
        setResetError(result.sendCodeError);
      }
    } catch (error) {
      setResetError("Có lỗi xảy ra khi gửi mã xác thực");
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
  // Hàm xử lý khi người dùng nhập identifier (email hoặc username)
  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setResetIdentifier(value);
    setIsUsername(!isValidEmail(value));
    setShowMailForget(false);
    setShowErrorMailForget("");
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu mới không khớp. Vui lòng nhập lại.");
      return;
    }

    const result = await resetPassword(resetEmail, newPassword);
    if (result.isResetSuccessful) {
      setPopupMessage(
        "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại.",
      );
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
                  className="animation"
                  style={{
                    "--i": 1,
                    "--j": 22,
                    height: 50,
                    marginBottom: 25,
                    marginTop: 25,
                  }}
                >
                  <InputText
                    id="login-userName"
                    label="Tài khoản"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  >
                    <PersonIcon />
                  </InputText>
                </div>
                <div className="animation" style={{ "--i": 2, "--j": 23 }}>
                  <InputPassword
                    id="login-password"
                    label="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )}
            {showEmailInput && (
              <>
                <div className="animation" style={{ "--i": 1, "--j": 22 }}>
                  <InputText
                    id="login-identifier"
                    label="Email hoặc tên tài khoản"
                    value={resetIdentifier}
                    onChange={handleIdentifierChange}
                  >
                    <EmailIcon />
                  </InputText>
                  {showEmailForget && (
                    <p className="error-message">{showErrorMailForget}</p>
                  )}
                </div>
                {isResetCodeSent && !isResetCodeVerified && (
                  <div className="animation" style={{ "--i": 2, "--j": 23 }}>
                    <InputText
                      id="forgot-code"
                      label="Mã xác thực"
                      value={resetVerificationCode}
                      onChange={(e) => setResetVerificationCode(e.target.value)}
                    />
                  </div>
                )}
                {isResetCodeVerified && (
                  <>
                    <div className="animation" style={{ "--i": 3, "--j": 24 }}>
                      <InputPassword
                        id="forgot-password"
                        label="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="animation" style={{ "--i": 4, "--j": 25 }}>
                      <InputPassword
                        id="forgot-confirm-password"
                        label="Nhập lại mật khẩu"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
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
              style={{ "--i": 5, "--j": 26, marginTop: 20 }}
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
            <div className="animation" style={{ "--i": 18, "--j": 1 }}>
              <InputText
                id="register-userName"
                label="Tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              >
                <PersonIcon />
              </InputText>
              {/* Hiển thị thông báo lỗi nếu có */}
              {checkAccountError && (
                <p className="error-message">{checkAccountError}</p>
              )}
            </div>
            <div className="animation" style={{ "--i": 20, "--j": 3 }}>
              <InputPassword
                id="register-password"
                label="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="animation" style={{ "--i": 18, "--j": 1 }}>
              <InputText
                id="register-fullName"
                label="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              >
                <EditNoteIcon />
              </InputText>
            </div>
            <div className="animation" style={{ "--i": 18, "--j": 1 }}>
              <InputText
                id="register-phone"
                type="tel"
                label="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhone(e.target.value)}
              >
                <PhoneAndroidIcon />
              </InputText>
            </div>
            <div className="animation" style={{ "--i": 18, "--j": 1 }}>
              <InputText
                id="register-email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              >
                <EmailIcon />
              </InputText>
            </div>
            {showErrorRegister && (
              <p className="error-message">{errorRegister}</p>
            )}
            {/* Trường nhập mã xác thực */}
            {showVerify && (
              <div className="animation" style={{ "--i": 18, "--j": 1 }}>
                <InputText
                  id="register-email"
                  label="Mã xác thực"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                {showCountDown && <p>Thời gian còn lại: {countdown} giây</p>}
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
