import axios from 'axios';

const putData = async (api, params) => {
  try {
    const response = await axios.put(api, params);
    return response.data; // Kết quả trả về từ server
  } catch (error) {
    console.error('Error putting data:', error);
    return null;
  }
};

export { putData };