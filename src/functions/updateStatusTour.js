import axios from 'axios';
import { UPDATE_TOUR_STATUS, getAPI } from '../config/host';
const updateStatusTour = async (tourId, status) => {
    const response = await axios.put(
      getAPI(UPDATE_TOUR_STATUS, { status }, tourId),
    );
    return response.data;
  };
export { updateStatusTour };