import { CHECK_USER_EXISTS, getAPI } from '../config/host';

const checkEmailExists = async (email) => {
    if (!email) {
        return { emailExists: false, checkEmailError: "" };
    }
    let result = {};
    try {
        const response = await fetch(getAPI(CHECK_USER_EXISTS, null, email));
        if (!response.ok) {
            result = { emailExists: false, checkEmailError: "Không thể kiểm tra email." };
        } else {
            const exists = await response.json();
            result.emailExists = exists;
            result.checkEmailError = exists ? "Email đã tồn tại." : "";
            console.log(result);
            
        }
    } catch (error) {
        result.checkEmailError = error.message;
    }
    return result;
};

export default checkEmailExists;