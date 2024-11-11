import axios from "axios";

const postData = async (api, params) => {
  debugger;
  try {
    const response = await axios.post(api, params);
    return response.data; // Kết quả trả về từ server
  } catch (error) {
    console.error("Error posting data:", error);
    return null;
  }
};

const uploadFile = async (api, formData) => {
  try {
    const response = await axios.post(api, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Kết quả trả về từ server
  } catch (error) {
    console.error("Error posting data:", error);
    return null;
  }
};

export { postData, uploadFile };
