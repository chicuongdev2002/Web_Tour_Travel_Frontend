const REACT_APP_HOST = "http://localhost:8080";
const GET_ALL_TOUR = REACT_APP_HOST + "/api/tours";
const CHECK_ACCOUNT_EXISTS = REACT_APP_HOST + "/api/accounts/exists";
const CHECK_USER_EXISTS = REACT_APP_HOST + "/api/users/exists";
const SEND_CODE_VERIFYCATION = REACT_APP_HOST + "/api/verification/send-code";
const VERIFY_CODE = REACT_APP_HOST + "/api/verification/verify-code";
const LOGIN = REACT_APP_HOST + "/api/accounts/login";
const REGISTER = REACT_APP_HOST + "/api/accounts/register";
const RESET_PASSWORD = REACT_APP_HOST + "/api/accounts/reset-password";
const SEARCH = REACT_APP_HOST + "/api/tours/search";
const GET_TOUR_DETAIL = REACT_APP_HOST + "/api/tours";
const GET_EMAIL = REACT_APP_HOST + "/api/accounts/email";
const BOOKING_TOUR = REACT_APP_HOST + "/api/bookings/createBooking";
const GET_PAGE_BOOKING = REACT_APP_HOST + "/api/bookings/page";
const GET_PAGE_DESTINATION = REACT_APP_HOST + "/api/destinations/page";
const POST_TOUR = REACT_APP_HOST + "/api/tours/addTour";
const CHANGE_PASSWORD = REACT_APP_HOST + "/api/accounts/change-password";
const GET_USER = REACT_APP_HOST + "/api/users";
const GET_ACCOUNT = REACT_APP_HOST + "/api/accounts";
const ACCOUNT_LOCK = REACT_APP_HOST + "/api/accounts/lock";
const ACCOUNT_UNLOCK = REACT_APP_HOST + "/api/accounts/unlock";
const UPDATE_BOOKING_STATUS = REACT_APP_HOST + "/api/bookings/updateStatus";
const UPLOAD_IMAGE = REACT_APP_HOST + "/api/tours/upload";
const getAPI = (api, params, paramId) => {
  if (paramId) {
    return api + "/" + paramId;
  }
  let url = api + "?";
  for (const key in params) {
    url += key + "=" + params[key] + "&&";
  }
  return url;
};

export default REACT_APP_HOST;
export {
  GET_ALL_TOUR,
  CHECK_ACCOUNT_EXISTS,
  CHECK_USER_EXISTS,
  BOOKING_TOUR,
  GET_PAGE_BOOKING,
  SEND_CODE_VERIFYCATION,
  VERIFY_CODE,
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  SEARCH,
  GET_TOUR_DETAIL,
  GET_EMAIL,
  GET_PAGE_DESTINATION,
  POST_TOUR,
  CHANGE_PASSWORD,
  GET_USER,
  GET_ACCOUNT,
  ACCOUNT_LOCK,
  ACCOUNT_UNLOCK,
  UPDATE_BOOKING_STATUS,
  UPLOAD_IMAGE,
  getAPI,
};
