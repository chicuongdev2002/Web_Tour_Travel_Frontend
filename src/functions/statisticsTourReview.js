import axios from "axios";
import {
  STATIS_TOUR_REVIEW,
  REVIEW_MONTHLY_STATIS,
  getAPI,
} from "../config/host";

const statisticsTourReview = async () => {
  try {
    const url = getAPI(STATIS_TOUR_REVIEW, null, null);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin review: " + error.message);
  }
};
const reviewMonthlyStatis = async () => {
  try {
    const url = getAPI(REVIEW_MONTHLY_STATIS, null, null);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin review: " + error.message);
  }
};
export { statisticsTourReview, reviewMonthlyStatis };
