import axios from "axios";
import { CHECK_ACCOUNT_EXISTS, getAPI } from "../config/host";

const checkAccountExists = async (username) => {
  if (!username) {
    return { accountExists: false, checkAccountError: "" };
  }
  let result = {};
  try {
    const response = await axios.get(getAPI(CHECK_ACCOUNT_EXISTS, null, username));
    if (!response) {
      result = {
        accountExists: false,
        checkAccountError: "Không thể kiểm tra tài khoản.",
      };
      console.log(result);
    } else {
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
