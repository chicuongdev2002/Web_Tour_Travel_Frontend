import axios from "axios";
import { TOUR_GUIDE_ASSIGNMENT,getAPI } from "../config/host";

const getTourAssignment = async (page, pageSize) => {
 const url = getAPI(TOUR_GUIDE_ASSIGNMENT, null,null);
 const response = await axios.get(`${url}?page=${page}&size=${pageSize}`);
  return response;
};  

export { getTourAssignment };
