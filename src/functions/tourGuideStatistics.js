
import axios from 'axios';
import { TOUR_GUIDE } from '../config/host';

export const getTourGuideStatistic = async () => {
  try {
    const response = await axios.get(`${TOUR_GUIDE}/statistics`);
    return {success: true,data:response.data};
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Không lấy được thống kê' };
  }
};
export const getTourGuideWorkingHour = async (startISO,endISO) => {
  try {
    const response = await axios.get(`${TOUR_GUIDE}/working-hours?startDate=${startISO}&endDate=${endISO}`);
    return {success: true,data:response.data};
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Không lấy được thống kê' };
  }
  
};
export const updateTourGuide = async (formData) => {
  try {
    const response = await axios.put(`${TOUR_GUIDE}`,formData);
    return {success: true,data:response.data};
  } catch (error) {
    return { success: false, error: "Update thất bại" };
  }
  
};