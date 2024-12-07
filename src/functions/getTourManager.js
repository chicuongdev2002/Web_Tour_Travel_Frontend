import axios from "axios";
import { GET_TOUR_MANAGER, getAPI } from "../config/host";

const getTourManager = async (page, pageSize) => {
  try {
    // debugger;
    const url = getAPI(GET_TOUR_MANAGER, null,null);
    const response = await axios.get(`${url}?page=${page}&size=${pageSize}`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin tour: " + error.message);
  }
};

export { getTourManager };
