import axios from "axios";
import { GET_USER, getAPI } from '../config/host';

const updateUser = async (userId, userData) => {
    let result = {};
    try {
        // Gọi API với userId trong URL và userData trong body
        const response = await axios.put(getAPI(`${GET_USER}/${userId}`), userData);

        // Kiểm tra phản hồi
        if (response.status === 200) {
            result = { isUpdateSuccessful: true, data: response.data };
        } else {
            result = { isUpdateSuccessful: false, error: "Đã xảy ra lỗi" };
        }
    } catch (error) {
        if (error.response) {
            result = { isUpdateSuccessful: false, error: "Cập nhật thông tin thất bại!" };
        } else {
            result = { isUpdateSuccessful: false, error: error.message };
        }
        console.error("API call failed:", error);
    }
    return result;
};

export default updateUser;