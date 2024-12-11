import axios from "axios";
import {
  FAVORITE_TOUR,
  getAPI,
} from "../config/host";
import axiosInstance from "../config/axios";

const getFavoriteTour = async (userId) => {
  try {
    const url = getAPI(`${FAVORITE_TOUR}/favorites/${userId}`, null, null);
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    throw new Error("Không thể lấy thông tin review: " + error.message);
  }
};

const getAllFavoriteTour = async () => {
  try {
    const url = getAPI(`${FAVORITE_TOUR}`, null, null);
    const response = await axios.get(url);
    return response ;
  } catch (error) {
    throw new Error("Không thể lấy thông tin review: " + error.message);
  }
};
export { getFavoriteTour,getAllFavoriteTour };
