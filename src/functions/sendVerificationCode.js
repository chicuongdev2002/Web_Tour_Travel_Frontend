import host from '../config/host';

const API_URL = `${host}/api`;

const sendVerificationCode = async (email) => {
    let result = {};
    try {
        const response = await fetch(`${API_URL}/verification/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            result = { isCodeSent: false, sendCodeError: "Không thể gửi mã xác thực." };
        } else {
            result = { isCodeSent: true, sendCodeError: "" };
        }
    } catch (error) {
        result = { isCodeSent: false, sendCodeError: error.message };
    }
    return result;
};

export default sendVerificationCode;