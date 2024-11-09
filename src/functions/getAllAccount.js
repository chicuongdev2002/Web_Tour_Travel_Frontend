import axios from "axios";
import { GET_ACCOUNT, getAPI } from "../config/host";

const getAllAccounts = async () => {
  let result = {};
  try {
    // Gọi API để lấy danh sách tài khoản
    const response = await axios.get(getAPI(GET_ACCOUNT));

    // Kiểm tra phản hồi
    if (response.status === 200) {
      result = { isFetchSuccessful: true, data: response.data };
    } else {
      result = { isFetchSuccessful: false, error: "Đã xảy ra lỗi" };
    }
  } catch (error) {
    if (error.response) {
      result = {
        isFetchSuccessful: false,
        error: "Lấy danh sách tài khoản thất bại!",
      };
    } else {
      result = { isFetchSuccessful: false, error: error.message };
    }
    console.error("API call failed:", error);
  }
  return result;
};

export default getAllAccounts;
