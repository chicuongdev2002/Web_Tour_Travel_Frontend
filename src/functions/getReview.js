import axios from "axios";
import { REVIEW_ALL, getAPI } from "../config/host";

const getReview = async (page, pageSize, keyword = null, rating = null, startDate = null, endDate = null, active = null) => {
  try {
    const url = getAPI(REVIEW_ALL, null, null);
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("size", pageSize);

    if (keyword) params.append("keyword", keyword);
    if (rating) params.append("rating", rating);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (active !== null) params.append("active", active);
console.log(params.toString());
    const response = await axios.get(`${url}?${params.toString()}`);
    console.log("response", response);
     
    if (response.status === 200) {
      return response;
      throw new Error("Unexpected response status: " + response.status);
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Không thể lấy thông tin review: " + error.message);
  }
};

const changeActive = async (reviewId, currentStatus) => {
  try {
    const url = getAPI(REVIEW_ALL, null, null);
    const response = await axios.patch(`${url}/${reviewId}/status`, null, {
      params: { isActive: !currentStatus },
    });

    if (response.status === 200) {
      return true; 
    } else {
      console.error("Failed to change status:", response);
      return false;
    }
  } catch (error) {
    console.error("Error changing review status:", error);
    throw new Error("Không thể thay đổi trạng thái review: " + error.message);
  }
};

export { getReview, changeActive };