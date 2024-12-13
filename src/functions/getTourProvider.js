import axios from "axios";
import { GET_TOUR_PROVIDER, getAPI } from "../config/host";

const getTourProvider = async (userId,page, pageSize) => {
  try {
    // debugger;
    const url = getAPI(GET_TOUR_PROVIDER, null, null);
    const response = await axios.get(`${url}/${userId}?page=${page}&size=${pageSize}`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin tour: " + error.message);
  }
};

export { getTourProvider };
