import axios from "axios";
import { TOUR_GUIDE,GET_ALL_DEPARTURE,getAPI, ASSIGNMENT_TOURGUIDE } from "../config/host";


const getAllDeparture = async () => {
 const url = getAPI(GET_ALL_DEPARTURE, null,null);
 const response = await axios.get(`${url}`);
  return response;
};  
const getTourGuide = async () => {
 const url = getAPI(TOUR_GUIDE, null,null);
 const response = await axios.get(`${url}`);
  return response;
};  
const assignmentTourGuide = async (guideIds,departureId) => {
 const url = getAPI(ASSIGNMENT_TOURGUIDE, null,null);
 const response = await axios.post(`${url}`,{
          guideIds:guideIds,
          departureId:departureId,
        },);
  return response;
};  

export { getAllDeparture,getTourGuide,assignmentTourGuide};
