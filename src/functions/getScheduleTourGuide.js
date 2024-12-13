import axios from "axios";
import { TOURGUIDE_SCHEDULE, getAPI } from "../config/host";

const getScheduleTourGuide = async (id) => {
  try {
    const url = getAPI(TOURGUIDE_SCHEDULE, null, id);
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw new Error("Không thể lấy thông tin tour: " + error.message);
  }
};

export { getScheduleTourGuide };
