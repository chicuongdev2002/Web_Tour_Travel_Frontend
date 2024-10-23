import host from '../config/host';

const API_URL = `${host}/api`;

const verifyCode = async (email, code) => {
    let result = {};
    try {
        const response = await fetch(`${API_URL}/verification/verify-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });
        if (!response.ok) {
            result = { isCodeValid: false, verifyCodeError: "Mã xác thực không hợp lệ." };
        } else {
            result = { isCodeValid: true, verifyCodeError: "" };
            console.log("Xác thực mã thành công",result);
            
        }
    } catch (error) {
        result = { isCodeValid: false, verifyCodeError: error.message };
    }
    return result;
};

export default verifyCode;