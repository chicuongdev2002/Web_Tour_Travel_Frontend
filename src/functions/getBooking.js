import axios from "axios";
import { GET_BOOKING_ID, getAPI } from "../config/host";

const getBookingId = async (bookingId) => {
    const url = getAPI(GET_BOOKING_ID, null, bookingId);
    const response = await axios.get(url);
    return response.data;
};
  
export { getBookingId };