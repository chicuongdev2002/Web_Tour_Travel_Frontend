import axios from "axios";
import { GET_ALL_TOUR, getAPI } from "../config/host";

const getAllTour = async (searchParams) => {
  const {
    keyword = "",
    page = 0,
    size = 8,
    minPrice = 0,
    maxPrice = 100000000,
    startLocation = "",
    tourType = "",
    participantType = "",
  } = searchParams;

  const result = await axios.get(
    getAPI(GET_ALL_TOUR, {
      keyword,
      page,
      size,
      minPrice,
      maxPrice,
      startLocation,
      tourType,
      participantType,
    }),
  );

  return result.data;
};

export { getAllTour };
