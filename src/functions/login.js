import axios from 'axios';
import REACT_APP_HOST, { LOGIN } from '../config/host';

const axiosInstance = axios.create({
  baseURL: `${REACT_APP_HOST}`,
  withCredentials: true ,
  // headers: {
  //   'Content-Type': 'application/json'
  // }
});

const login = async (username, password) => {
  try {
    const response = await axiosInstance.post(`${LOGIN}`, 
      new URLSearchParams({
        username: username,
        password: password
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    // Xử lý response
    return { 
      isLoginSuccessful: true, 
      loginError: "", 
      userData: response.data 
    };
  } catch (error) {
    // Xử lý các trường hợp lỗi
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return { 
            isLoginSuccessful: false, 
            loginError: "Mật khẩu không chính xác" 
          };
        case 404:
          return { 
            isLoginSuccessful: false, 
            loginError: "Tài khoản không tồn tại" 
          };
        case 403:
          return { 
            isLoginSuccessful: false, 
            loginError: "Tài khoản bị khóa" 
          };
        default:
          return { 
            isLoginSuccessful: false, 
            loginError: "Đăng nhập thất bại" 
          };
      }
    }
    return { 
      isLoginSuccessful: false, 
      loginError: error.message 
    };
  }
};

export default login;