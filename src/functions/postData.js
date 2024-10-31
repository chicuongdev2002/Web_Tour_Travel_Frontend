import axios from 'axios';

const postData = async (api, params) => {
  try {
    const response = await axios.post(api, params);
    console.log(response.data); // Kết quả trả về từ server
  } catch (error) {
    console.error('Error posting data:', error);
  }
};

export { postData };