import axios from "axios";
import { APPROVE_TOUR, getAPI } from "../config/host";

const approveTour = async (tourId) => {
  try {
    const url = getAPI(APPROVE_TOUR, null, tourId);
    const response = await axios.post(url);
    if (response.status === 200) {
      console.log("Tour được phê duyệt thành công");
      return true; // Trả về true nếu phê duyệt thành công
    } else {
      console.error("Error approving tour:", response.data);
      return false; // Trả về false nếu có lỗi
    }
  } catch (error) {
    console.error("Error:", error);
    return false; // Trả về false nếu có lỗi trong yêu cầu
  }
};

export { approveTour };
