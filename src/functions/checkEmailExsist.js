import host from '../config/host';

const API_URL = `${host}/api`;

const checkEmailExists = async (email) => {
    if (!email) {
        return { emailExists: false, checkEmailError: "" };
    }
    let result = {};
    try {
        const response = await fetch(`${API_URL}/users/exists/${email}`);
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