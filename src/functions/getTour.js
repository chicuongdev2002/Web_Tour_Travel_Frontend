import axios from "axios";
import { GET_ALL_TOUR, GET_TOUR_PAGE, getAPI } from "../config/host";

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

const getTourPage = async (page, size, sortBy, sortDirection) => {
  if (page === undefined) page = 0;
  if (size === undefined) size = 10;
  if (sortBy === undefined) sortBy = "tourName";
  if (sortDirection === undefined) sortDirection = "asc";
  const result = await axios.get(getAPI(GET_TOUR_PAGE, {page, size, sortBy, sortDirection}));
  return result.data;
};

export { getAllTour, getTourPage };
