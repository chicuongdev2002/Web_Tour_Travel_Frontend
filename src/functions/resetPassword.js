import host from '../config/host';

const API_URL = `${host}/api`;

const resetPassword = async (email, newPassword) => {
    let result = {};
    try {
        const response = await fetch(`${API_URL}/accounts/reset-password?email=${email}&newPassword=${newPassword}`, {
            method: 'POST',
        });
        if (!response.ok) {
            result = { isResetSuccessful: false, resetError: "Đặt lại mật khẩu thất bại" };
        } else {
            result = { isResetSuccessful: true, resetError: "" };
            console.log(result);
            
        }
    } catch (error) {
        result = { isResetSuccessful: false, resetError: error.message };
    }
    return result;
};

export default resetPassword;