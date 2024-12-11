import axios from 'axios';
import { LOG_OUT } from '../config/host';
// import axiosInstance from '../config/axios';
const logout = async () => {
  try {
    const response = await axios.delete(`${LOG_OUT}`, {
      withCredentials: true,
    });
    console.log('logout -> response', response);
    return response.data; 
  } catch (error) {
    if (error.response) {
      console.error("Lỗi khi đăng xuất:", error.response.data);
      throw new Error(error.response.data || "Đã xảy ra lỗi khi đăng xuất.");
    } else {
      console.error("Lỗi mạng:", error.message);
      throw new Error("Lỗi mạng. Vui lòng kiểm tra kết nối của bạn.");
    }
  }
};

export default logout;