import { BOOKING_DETAIL } from "../config/host";

export const getBookingDetail = async (userId) => {
  try {
    const response = await axios.get(`${BOOKING_DETAIL}/${userId}`);
    return response;
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to booking' };
  }
};