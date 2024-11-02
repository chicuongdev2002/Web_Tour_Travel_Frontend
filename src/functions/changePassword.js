import axios from "axios";
import { CHANGE_PASSWORD } from '../config/host'; 

const changePassword = async (userId, oldPassword, newPassword) => {
    let result = {};
    try {
        // Tạo query params
        const params = new URLSearchParams({
            userId,
            oldPassword,
            newPassword
        });
        console.log(params.toString());
        // Gọi API với các tham số trong URL
        const response = await axios.put(`${CHANGE_PASSWORD}?${params.toString()}`);

        // Kiểm tra phản hồi
        if (response.status === 200) {
            result = { isChangeSuccessful: true };
        } else {
            result = { isChangeSuccessful: false, error: "Đã xảy ra lỗi" };
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                result = { isChangeSuccessful: false, error: "Mật khẩu hiện tại không đúng!" };
            } else {
                result = { isChangeSuccessful: false, error: "Đổi mật khẩu thất bại!" };
            }
        } else {
            result = { isChangeSuccessful: false, error: error.message };
        }
        console.error("API call failed:", error);
    }
    return result;
};

export default changePassword;