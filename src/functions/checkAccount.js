import host from '../config/host';

const API_URL = `${host}/api`;

const checkAccountExists = async (username) => {
    if (!username) {
        return { accountExists: false, checkAccountError: "" };
    }
    let result = {};
    try {
        const response = await fetch(`${API_URL}/accounts/exists/${username}`);
        if (!response.ok) {
            result = { accountExists: false, checkAccountError: "Không thể kiểm tra tài khoản." };
        } else {
            const exists = await response.json();
            result.accountExists = exists;
            result.checkAccountError = exists ? "Tài khoản đã tồn tại." : "";
            console.log(result);
            
        }
    } catch (error) {
        result.checkAccountError = error.message;
    }
    return result;
};

export default checkAccountExists;