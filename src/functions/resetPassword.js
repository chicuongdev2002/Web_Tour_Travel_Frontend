import { RESET_PASSWORD, getAPI } from "../config/host";

const resetPassword = async (email, newPassword) => {
  let result = {};
  try {
    const response = await fetch(
      getAPI(RESET_PASSWORD, { email, newPassword }),
      {
        method: "POST",
      },
    );
    if (!response.ok) {
      result = {
        isResetSuccessful: false,
        resetError: "Đặt lại mật khẩu thất bại",
      };
    } else {
      result = { isResetSuccessful: true, resetError: "" };
      console.log(result);
    }
  } catch (error) {
    result = { isResetSuccessful: false, resetError: error.message };
  }
  return result;
};

export default resetPassword;
