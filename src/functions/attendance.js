import { ATTENDANCE } from "../config/host";

export const markAttendance = async (userId, departureId, startLocation) => {
  let result = {
    success: false,
    message: "",
    error: null
  };

  try {
    const response = await fetch(ATTENDANCE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        departureId,
        startLocation
      }),
    });

    const data = await response.text();

    if (response.ok) {
      result.success = true;
      result.message = "Điểm danh thành công!";
    } else {
      result.success = false;
      result.error = data;
    }
  } catch (error) {
    result.success = false;
    result.error = "Có lỗi xảy ra khi kết nối đến máy chủ";
  }

  return result;
};