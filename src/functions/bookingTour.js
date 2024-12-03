import axios from "axios";
import {
  BOOKING_TOUR,
  GET_PAGE_BOOKING,
  getAPI,
  UPDATE_BOOKING_STATUS,
  GET_BOOKING,
  CANCEL_BOOKING
} from "../config/host";

const getAllBooking = async (page, size, userId, sortBy, sortDirection) => {
  if (page === undefined) page = 0;
  if (size === undefined) size = 10;
  if (sortBy === undefined) sortBy = "bookingDate";
  if (sortDirection === undefined) sortDirection = "desc";
  debugger
  if (userId === undefined) userId = 0;
  const result = await axios.get(
    getAPI(GET_PAGE_BOOKING, { page, size, sortBy, sortDirection, userId }),
  );
  return result.data;
};

const bookingTour = async (data) => {
  const response = await axios.post(getAPI(BOOKING_TOUR, data));
  return response.data;
};

const updateBookingStatus = async (bookingId) => {
  const response = await axios.put(
    getAPI(UPDATE_BOOKING_STATUS, { bookingId }),
  );
  return response.data;
};

const getBooking = async (bookingId) => {
  let url = getAPI(GET_BOOKING, {bookingId});
  const response = await axios.get(url);
  return response.data;
};

const cancelBooking = async (bookingId, userId) => {
  const response = await axios.delete(
    getAPI(CANCEL_BOOKING, { userId }, bookingId),
  );
  return response.data;
}

export { getAllBooking, updateBookingStatus, getBooking, cancelBooking };
export default bookingTour;
