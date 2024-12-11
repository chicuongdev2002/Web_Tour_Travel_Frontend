import axios from "axios";
import FAVORITE_TOUR from "../config/host";

export const addFavoriteTour = async (userId, tourId) => {
  const response = await axios.post(`http://localhost:8080/api/favorite-tours?userId=${userId}&tourId=${tourId}`);
  return  response;
};
