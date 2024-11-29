import axios from "axios";
import { GET_ALL_TOUR_TEST, getAPI } from "../config/host";

const getAllTourTest = async (searchParams) => {
  const {
    page = 0,
    size = 10000,
    keyword,
    startLocation,
    tourType,
    participantType,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    userId,
  } = searchParams;

  const params = {
    page,
    size,
  };

  if (keyword) params.keyword = keyword;
  if (startLocation) params.startLocation = startLocation;
  if (tourType) params.tourType = tourType;
  if (participantType) params.participantType = participantType;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (userId) params.userId = userId; 

  const result = await axios.get(getAPI(GET_ALL_TOUR_TEST, params));

  return result.data;
};

export { getAllTourTest };