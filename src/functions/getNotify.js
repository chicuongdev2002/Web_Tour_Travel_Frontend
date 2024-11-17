import axios from "axios";
import { GET_NOTIFY, getAPI } from "../config/host";

const getNotify = async (params, id) => {
  if(params.page === undefined) params.page = 0;
  if(params.size === undefined) params.size = 10;
  let result;
  if(id == undefined){
    if(params.sortBy === undefined) params.sortBy = 'createDate';
    if(params.sortDirection === undefined) params.sortDirection = 'desc';
    result = await axios.get(
      getAPI(GET_NOTIFY, params),
    );
  } else {
    result = await axios.get(
      getAPI(GET_NOTIFY, null, id),
    );
  }
  
  return result.data;
};

export { getNotify };
