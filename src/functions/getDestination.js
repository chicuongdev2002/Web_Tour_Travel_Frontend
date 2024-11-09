import axios from "axios";
import { GET_PAGE_DESTINATION, getAPI } from "../config/host";

const getAllDestination = async (page, size, sortBy, sortDirection) => {
  if (page === undefined) page = 0;
  if (size === undefined) size = 4;
  if (sortBy === undefined) sortBy = "destinationId";
  if (sortDirection === undefined) sortDirection = "asc";
  const result = await axios.get(
    getAPI(GET_PAGE_DESTINATION, { page, size, sortBy, sortDirection }),
  );
  return result.data;
};

export { getAllDestination };
