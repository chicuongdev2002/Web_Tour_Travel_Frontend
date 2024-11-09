import { REGISTER, getAPI } from '../config/host';

const register = async (username, password, fullName, phoneNumber, email) => {
    let result = {};
    try {
        const response = await fetch(getAPI(REGISTER), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, fullName, phoneNumber, email }), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            result = { isRegisterSuccessful: false, registerError: errorData.message || "Đăng ký thất bại" };
        } else {
            const data = await response.json();
            result = { isRegisterSuccessful: true, registerError: "", userData: data };
            console.log("Đăng ký thành công", result);
        }
    } catch (error) {
        result = { isRegisterSuccessful: false, registerError: error.message };
    }
    return result;
};

export default register;