
import axios from 'axios';
import { TOUR_SIMPLE } from '../config/host';

export const getTourSimple = async () => {
  try {
    const response = await axios.get(`${TOUR_SIMPLE}`);
    return {success: true,data:response.data};
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch customers' };
  }
};