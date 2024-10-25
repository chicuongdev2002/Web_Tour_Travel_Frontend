import axios from "axios";
import { BOOKING_TOUR, getAPI } from "../config/host";

export default async function bookingTour(data) {
    const response = await axios.post(getAPI(BOOKING_TOUR, data));
    return response.data;
}