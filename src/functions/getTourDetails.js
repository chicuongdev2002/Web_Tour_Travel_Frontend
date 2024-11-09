import axios from "axios";
import { GET_TOUR_DETAIL, getAPI } from "../config/host";

const getTourDetail = async (id) => {
  try {
    const url = getAPI(GET_TOUR_DETAIL, null, id);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin tour: " + error.message);
  }
};

export { getTourDetail };
