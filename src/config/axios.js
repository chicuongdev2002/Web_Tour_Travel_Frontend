import axios from 'axios';
import { toast } from 'react-toastify';
import {
  getAccessToken,
  updateAccessToken,
  clearAuthData
} from './auth';
import REACT_APP_HOST, { LOG_OUT, REFRESH_TOKEN_ENDPOINT } from './host';

// Tạo một instance Axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: `${REACT_APP_HOST}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// Hàm gửi yêu cầu làm mới token - không cần truyền refresh token vì đã có trong cookie
const refreshTokenRequest = async () => {
  try {
    const response = await axios.post(
      `${REFRESH_TOKEN_ENDPOINT}`,
      {},
      {
        withCredentials: true
      }
    );
     console.log('refreshTokenRequest -> response', response);
    const { token: newAccessToken } = response.data;
    updateAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
  //  if (!isLoggingOut) {
    clearAuthData();
    console.log('refreshTokenRequest -> error', error);
    toast.error('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setTimeout(() => {
      window.location.href = '/login-register';
    }, 5000);
  }
    throw error;
  }
// };

// Interceptor cho request - thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    console.log('token', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response - xử lý lỗi xác thực và làm mới token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshTokenRequest();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        toast.success('Token đã được làm mới', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      toast.error('Xác thực thất bại. Vui lòng đăng nhập lại.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;