// services/emailService.js
import axios from 'axios';
import { GET_EMAIL, getAPI } from '../config/host';

const getEmailFromUsername = async (username) => {
    let result = {
        isSuccess: false,
        email: '',
        error: ''
    };

    try {
        const response = await axios.get(getAPI(GET_EMAIL, null, username));
        
        if (response.status === 200) {
            result = {
                isSuccess: true,
                email: response.data,
                error: ''
            };
            console.log("Tìm thấy email", response.data);
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                result.error = 'Không tìm thấy tài khoản với tên đăng nhập này';
            } else {
                result.error = 'Lỗi khi tìm email';
            }
        } else {
            result.error = error.message;
        }
        console.error("API call failed:", error);
    }

    return result;
};

export default getEmailFromUsername;