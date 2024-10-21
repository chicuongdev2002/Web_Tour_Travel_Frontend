import axios from 'axios';
import host from '../config/host';

const API_URL = `${host}/api`;

const checkEmailExists = async (email) => {
    if (!email) {
        return {
            emailExists: false,
            checkEmailError: ""
        }
    }
    let result = {};
    try {
        const response = await fetch(`${API_URL}/users/exists/${email}`);
        if (!response.ok) {
            result = {
                emailExists: false,
                checkEmailError: "Không thể kiểm tra email."
            }
        } else {
            const exists = await response.json();
            result.emailExists = exists;
            result.checkEmailError = exists ? "Email đã tồn tại." : "";
        }
    } catch (error) {
        result.checkEmailError = error.message;
    }
    return result;
};

const checkAccountExists = async (username) => {
    if (!username) {
        return {
            accountExists: false,
            checkAccountError: ""
        }
    }
    let result = {};
    try {
        const response = await fetch(`${API_URL}/accounts/exists/${username}`);
        if (!response.ok) {
            result = {
                accountExists: false,
                checkAccountError: "Không thể kiểm tra tài khoản."
            }
        } else {
            const exists = await response.json();
            result.accountExists = exists;
            result.checkAccountError = exists ? "Tài khoản đã tồn tại." : "";
        }
    } catch (error) {
        result.checkAccountError = error.message;
    }
    return result;
};

const sendVerificationCode = async (email) => {
    let result = {};
    try {
        const response = await fetch(`${API_URL}/verification/send-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            result = {
                isCodeSent: false,
                sendCodeError: "Không thể gửi mã xác thực."
            }
        } else {
            const data = await response.json();
            result = {
                isCodeSent: true,
                sendCodeError: ""
            }
        }
    } catch (error) {
        result = {
            isCodeSent: false,
            sendCodeError: error.message
        }
    }
    return result;
};

const verifyCode = async (email, code) => {
    let result = {};
    try {
        const response = await fetch(`${API_URL}/verification/verify-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code }),
        });
        if (!response.ok) {
            result = {
                isCodeValid: false,
                verifyCodeError: "Mã xác thực không hợp lệ."
            }
        } else {
            const data = await response.json();
            result = {
                isCodeValid: true,
                verifyCodeError: ""
            }
        }
    } catch (error) {
        result = {
            isCodeValid: false,
            verifyCodeError: error.message
        }
    }
    return result;
};

const login = async (username, password) => {
    let result = {};
    try {
        const response = await fetch(`${API_URL}/accounts/login?username=${username}&password=${password}`, {
            method: 'POST',
        });
        if (!response.ok) {
            if (response.status === 401) {
                result = {
                    isLoginSuccessful: false,
                    loginError: "Mật khẩu không chính xác"
                }
            } else if (response.status === 404) {
                result = {
                    isLoginSuccessful: false,
                    loginError: "Tài khoản không tồn tại"
                }
            } else {
                result = {
                    isLoginSuccessful: false,
                    loginError: "Đăng nhập thất bại"
                }
            }
        } else {
            const data = await response.json();
            result = {
                isLoginSuccessful: true,
                loginError: "",
                userData: data
            }
        }
    } catch (error) {
        result = {
            isLoginSuccessful: false,
            loginError: error.message
        }
    }
    return result;
};

const register = async (username, password, fullName, phoneNumber, email) => {
    let result = {};
    try {
        const response = await fetch(`${API_URL}/accounts/register?username=${username}&password=${password}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullName, phoneNumber, email }),
        });
        if (!response.ok) {
            result = {
                isRegisterSuccessful: false,
                registerError: "Đăng ký thất bại"
            }
        } else {
            const data = await response.json();
            result = {
                isRegisterSuccessful: true,
                registerError: "",
                userData: data
            }
        }
    } catch (error) {
        result = {
            isRegisterSuccessful: false,
            registerError: error.message
        }
    }
    return result;
};

const resetPassword = async (email, newPassword) => {
    let result = {};
    try {
        const response = await fetch(`${API_URL}/accounts/reset-password?email=${email}&newPassword=${newPassword}`, {
            method: 'POST',
        });
        if (!response.ok) {
            result = {
                isResetSuccessful: false,
                resetError: "Đặt lại mật khẩu thất bại"
            }
        } else {
            result = {
                isResetSuccessful: true,
                resetError: ""
            }
        }
    } catch (error) {
        result = {
            isResetSuccessful: false,
            resetError: error.message
        }
    }
    return result;
};

export { 
    checkEmailExists, 
    checkAccountExists, 
    sendVerificationCode, 
    verifyCode, 
    login, 
    register, 
    resetPassword 
};