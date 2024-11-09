import axios from 'axios';
import { getAPI } from '../config/host';

const deleteData = async (api, params) => {
  try {
    const response = await axios.put(getAPI(api, null, params));
    return response.data; // Kết quả trả về từ server
  } catch (error) {
    console.error('Error deleting data:', error);
    return null;
  }
};

export { deleteData };