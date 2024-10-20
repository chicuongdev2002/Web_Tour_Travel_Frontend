import host from '../config/host';

const API_URL = `${host}/api`;

const register = async (username, password, fullName, phoneNumber, email) => {
    let result = {};
    try {
        const response = await fetch(`${API_URL}/accounts/register?username=${username}&password=${password}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, phoneNumber, email }),
        });
        if (!response.ok) {
            result = { isRegisterSuccessful: false, registerError: "Đăng ký thất bại" };
        } else {
            const data = await response.json();
            result = { isRegisterSuccessful: true, registerError: "", userData: data };
        }
    } catch (error) {
        result = { isRegisterSuccessful: false, registerError: error.message };
    }
    return result;
};

export default register;