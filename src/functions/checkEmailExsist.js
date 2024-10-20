const checkEmailExists = async (email) => {
    if (!email) {
        return {
            emailExists: false,
            checkEmailError: ""
        }
    }
    let result = {};
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/exists/${email}`,
      );
      if (!response.ok) {
        result = {
            emailExists: false,
            checkEmailError: "Không thể kiểm tra email."
        }
    }
        const exists = await response.json();
        result.emailExists = exists;
        result.checkEmailError = exists ? "Email đã tồn tại." : "";
    } catch (error) {
      result.checkEmailError = error.message;
    }
    return result;
};
export { checkEmailExists };