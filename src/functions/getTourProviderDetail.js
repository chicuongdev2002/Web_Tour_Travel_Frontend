
import axios from 'axios';
import { TOUR_PROVIDER_DETAILS } from '../config/host';

export const getTourProviderDetail = async (userId) => {
  try {
    const response = await axios.get(`${TOUR_PROVIDER_DETAILS}/${userId}`);
    return {success: true,data:response.data};
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch customers' };
  }
};