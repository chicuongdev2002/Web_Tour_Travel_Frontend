import axios from "axios";
import {
  TOUR_PROVIDER_DETAILS,
  getAPI,
} from "../config/host";

const getTourCountByUser = async () => {
  try {
    const url = getAPI(TOUR_PROVIDER_DETAILS, null, null);
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw new Error("Không thể lấy thông tin review: " + error.message);
  }
};
export { getTourCountByUser };
