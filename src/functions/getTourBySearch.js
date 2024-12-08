import { GET_ALL_TOUR, getAPI } from "../config/host";

const getTourBySearch = async (keyword) => {
  let url;
  for (let i in keyword) {
    url = getAPI(GET_ALL_TOUR, { i: keyword[i] });
  }
  const result = await axios.get(url);
  return result.data;
};

export { getTourBySearch };
