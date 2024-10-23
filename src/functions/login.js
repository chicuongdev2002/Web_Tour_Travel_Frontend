import { LOGIN } from '../config/host';

const login = async (username, password) => {
    let result = {};
    try {
        const response = await fetch(getAPI(LOGIN, {username, password}), {
            method: 'POST',
        });
        if (!response.ok) {
            if (response.status === 401) {
                result = { isLoginSuccessful: false, loginError: "Mật khẩu không chính xác" };
            } else if (response.status === 404) {
                result = { isLoginSuccessful: false, loginError: "Tài khoản không tồn tại" };
            } else {
                result = { isLoginSuccessful: false, loginError: "Đăng nhập thất bại" };
            }
        } else {
            const data = await response.json();
            result = { isLoginSuccessful: true, loginError: "", userData: data };
            console.log(result);
            
        }
    } catch (error) {
        result = { isLoginSuccessful: false, loginError: error.message };
    }
    return result;
};

export default login;