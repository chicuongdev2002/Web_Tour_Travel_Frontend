import axios from "axios";
import { GET_BOOKING_ID, GET_BOOKING_BY_TOUR, getAPI } from "../config/host";

const getBookingId = async (bookingId) => {
    const url = getAPI(GET_BOOKING_ID, null, bookingId);
    const response = await axios.get(url);
    return response.data;
};

const getBookingByTourId = async (tourId) => {
    debugger
    const url = getAPI(GET_BOOKING_BY_TOUR, {tourId});
    const response = await axios.get(url);
    return response.data;
};
  
export { getBookingId, getBookingByTourId };