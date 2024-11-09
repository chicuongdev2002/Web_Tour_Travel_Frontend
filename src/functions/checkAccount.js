import { CHECK_ACCOUNT_EXISTS, getAPI } from "../config/host";

const checkAccountExists = async (username) => {
  if (!username) {
    return { accountExists: false, checkAccountError: "" };
  }
  let result = {};
  try {
    const response = await fetch(getAPI(CHECK_ACCOUNT_EXISTS, null, username));
    if (!response.ok) {
      result = {
        accountExists: false,
        checkAccountError: "Không thể kiểm tra tài khoản.",
      };
      console.log(result);
    } else {
      const exists = await response.json();
      result.accountExists = exists;
      result.checkAccountError = exists ? "Tài khoản đã tồn tại." : "";
      console.log(result);
    }
  } catch (error) {
    result.checkAccountError = error.message;
    console.log(result);
  }
  return result;
};

export default checkAccountExists;
