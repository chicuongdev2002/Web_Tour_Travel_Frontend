import axios from "axios";
import { GET_ALL_TOUR_TEST, getAPI } from "../config/host";

const getAllTourTest = async (searchParams) => {
  const { page = 0, size = 10000 } = searchParams;

  const result = await axios.get(
    getAPI(GET_ALL_TOUR_TEST, {
      page,
      size,
    }),
  );

  return result.data;
};

export { getAllTourTest };
