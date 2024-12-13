import axios from "axios";
import { FAVORITE_TOUR } from "../config/host";

export const addFavoriteTour = async (userId, tourId) => {
  const response = await axios.post(`${FAVORITE_TOUR}?userId=${userId}&tourId=${tourId}`);
  return response;
};