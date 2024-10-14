import host from "../config/host";
import axios from "axios";
import { GET_ALL_TOUR, getAPI } from "../config/host";

const getAllTour = async (page, size) => {
    const result = await axios.get(getAPI(GET_ALL_TOUR, { page, size, minPrice: 0, maxPrice: 100000000 }));
    return result.data.content;
}

export { getAllTour };