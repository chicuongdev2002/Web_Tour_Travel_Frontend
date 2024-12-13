import axios from "axios";
import { DELETE_TOUR, getAPI } from "../config/host";

const deleteTour = async (tourId, userId) => {
  try {
    const url = getAPI(DELETE_TOUR, null, tourId); 
    const response = await axios.put(url, null, {
      params: { userId }
    });
    
    if (response.status === 200) {
      return true; 
    } else {
      console.error("Error deleting tour:", response.data);
      return false; 
    }
  } catch (error) {
    console.error("Error:", error);
    return false; 
  }
};

export { deleteTour };