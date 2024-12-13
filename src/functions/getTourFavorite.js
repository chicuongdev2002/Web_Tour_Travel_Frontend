import axios from "axios";
import { FAVORITE_TOUR } from "../config/host";

const getTourFavorite = async () => {
  const result = await axios.get(FAVORITE_TOUR);
  return result;
};

export { getTourFavorite };
