import axios from "axios";
import { LOGIN, getAPI } from "../config/host";

const login = async (username, password) => {
  let result = {};
  try {
    const response = await axios.post(getAPI(LOGIN, { username, password }));

    if (response.status === 200) {
      const data = response.data;
      result = { isLoginSuccessful: true, loginError: "", userData: data };
      console.log(result);
    } else {
      result = { isLoginSuccessful: false, loginError: "Đăng nhập thất bại" };
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        result = {
          isLoginSuccessful: false,
          loginError: "Mật khẩu không chính xác",
        };
      } else if (error.response.status === 404) {
        result = {
          isLoginSuccessful: false,
          loginError: "Tài khoản không tồn tại",
        };
      } else {
        result = { isLoginSuccessful: false, loginError: "Đăng nhập thất bại" };
      }
    } else {
      result = { isLoginSuccessful: false, loginError: error.message };
    }

    console.error("API call failed:", error);
  }
  return result;
};

export default login;
