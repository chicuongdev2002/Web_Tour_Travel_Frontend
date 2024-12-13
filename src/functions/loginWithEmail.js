import axios from "axios";
import {
  LOGIN_WITH_EMAIL,
} from "../config/host";

const loginWithEmail = async (email) => {
  try {
    const response = await axios.post(`${LOGIN_WITH_EMAIL}?email=${email}`);
    return response;
  } catch (error) {
    throw new Error("Không thể lấy thông tin review: " + error.message);
  }
};
export { loginWithEmail };
