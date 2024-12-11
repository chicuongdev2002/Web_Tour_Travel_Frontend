import axios from "axios";
import { TOUR_GUIDE, TOUR_GUIDE_ASSIGNMENT,getAPI } from "../config/host";

const getTourAssignment = async (page, pageSize) => {
 const url = getAPI(TOUR_GUIDE_ASSIGNMENT, null,null);
 const response = await axios.get(`${url}?page=${page}&size=${pageSize}`);
  return response;
};  
const getTourAssignmentSize999 = async () => {
 const url = getAPI(TOUR_GUIDE_ASSIGNMENT, null,null);
 const response = await axios.get(`${url}?size=9999999`);
  return response;
};  
const deleteAssignment = async (guideId,departureId) => {
 const url = getAPI(TOUR_GUIDE, null,null);
 const response = await axios.delete(`${url}/${guideId}/assignments/${departureId}`);
  return response;
};  
export { getTourAssignment,getTourAssignmentSize999,deleteAssignment};
