import axios from "axios";
import { GET_LINK_MOMO, GET_PAYMENT_BY_BOOKING, getAPI } from "../config/host";

const createLinkMomoPayment = async (
  amount,
  orderId,
  userId,
  departureId,
  participants,
  address,
) => {
  try {
    let url = getAPI(GET_LINK_MOMO, {
      amount,
      orderId,
      userId,
      departureId,
      participants,
      address,
    });
    const result = await axios.post(url);
    return result;
  } catch (e) {
    return e;
  }
};

const getPaymentByBooking = async (bookingId) => {
  let url = getAPI(GET_PAYMENT_BY_BOOKING, { bookingId });
  const result = await axios.get(url);
  return result.data;
};

export { createLinkMomoPayment, getPaymentByBooking };
