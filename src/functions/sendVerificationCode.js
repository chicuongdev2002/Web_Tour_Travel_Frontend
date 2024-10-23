import { SEND_CODE_VERIFYCATION } from '../config/host';

const sendVerificationCode = async (email) => {
    let result = {};
    try {
        const response = await fetch(SEND_CODE_VERIFYCATION, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            result = { isCodeSent: false, sendCodeError: "Không thể gửi mã xác thực." };
        } else {
            result = { isCodeSent: true, sendCodeError: "" };
            console.log("Gửi mã xác thực thành công",result);
            
        }
    } catch (error) {
        result = { isCodeSent: false, sendCodeError: error.message };
    }
    return result;
};

export default sendVerificationCode;