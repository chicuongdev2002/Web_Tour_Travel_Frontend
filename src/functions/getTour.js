import host from "../config/host";
import axios from "axios";

const getAllTour = async (page, size) => {
    const result = await axios.get(`${host}/api/tours?page=${page}&&size=${size}&&minPrice=0&&maxPrice=100000000`);
    return result.data.content;
}

export { getAllTour };