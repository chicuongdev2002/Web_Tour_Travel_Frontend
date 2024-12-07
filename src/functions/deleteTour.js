import axios from "axios";
import { DELETE_TOUR, getAPI } from "../config/host";

const deleteTour = async (tourId) => {
  try {
    const url = getAPI(DELETE_TOUR, null, tourId);
    const response = await axios.post(url);
    if (response.status === 200) {
      return true; 
    } else {
      console.error("Error approving tour:", response.data);
      return false; 
    }
  } catch (error) {
    console.error("Error:", error);
    return false; 
  }
};

export { deleteTour };
