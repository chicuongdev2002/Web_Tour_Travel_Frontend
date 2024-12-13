import axios from 'axios';
import { toast } from 'react-toastify';
import REACT_APP_HOST, { REFRESH_TOKEN_ENDPOINT } from '../config/host';
import axiosInstance from '../config/axios';

// const axiosInstance = axios.create({
//   baseURL: `${REACT_APP_HOST}`,
//   withCredentials: true  
// });

const refreshToken = async () => {
  try {
    const response = await axiosInstance.post(
      `${REFRESH_TOKEN_ENDPOINT}`,
      {},
    //   {
    //      withCredentials: true  
    //   }
    );
   toast.success('Token đã được làm mới', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    const { token: newAccessToken } = response.data; 
    return newAccessToken; 
  } catch (error) {
     toast.error('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};

export default refreshToken;