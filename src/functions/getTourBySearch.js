import host from "../config/host";
import axios from "axios";

const getTourBySearch = async (keyword) => {
  const result = await axios.get(
    `${host}/api/tours/search?keyword=${keyword}&&page=${page}&&size=${size}`,
  );
  return result.data;
};

export { getTourBySearch };
