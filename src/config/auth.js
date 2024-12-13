const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user'
};

// Lưu thông tin authentication
export const storeAuthData = (userData, accessToken) => {
  sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
};

// Lấy access token
export const getAccessToken = () => {
  return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

// Lấy thông tin user
export const getUser = () => {
  const userStr = sessionStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

// Kiểm tra đã đăng nhập chưa
export const isAuthenticated = () => {
  return !!getAccessToken() && !!getUser();
};

// Xóa thông tin authentication khi logout
export const clearAuthData = () => {
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
};

// Cập nhật token mới
export const updateAccessToken = (newToken) => {
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
};