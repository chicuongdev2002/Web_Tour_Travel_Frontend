import axios from 'axios';
import { ITINERARY_BOOKING_TOUR } from '../config/host';
import axiosInstance from '../config/axios';

export const getItineraryByUserId = async (userId) => {
  try {
    const response = await axios.get(`${ITINERARY_BOOKING_TOUR}/${userId}`,);
    return response; 
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return { error: error.message }; 
  }
};