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
const GET_NOTIFY = REACT_APP_HOST + "/api/notifications";
const BOOKING_TOUR = REACT_APP_HOST + "/api/bookings/createBooking";
const GET_PAGE_BOOKING = REACT_APP_HOST + "/api/bookings/page";
const GET_PAGE_DESTINATION = REACT_APP_HOST + "/api/destinations/page";
const POST_TOUR = REACT_APP_HOST + "/api/tours/addTour";
const CHANGE_PASSWORD = REACT_APP_HOST + "/api/accounts/change-password";
const GET_USER = REACT_APP_HOST + "/api/users";
const GET_ACCOUNT = REACT_APP_HOST + "/api/accounts";
const ACCOUNT_LOCK = REACT_APP_HOST + "/api/accounts/lock";
const ACCOUNT_UNLOCK = REACT_APP_HOST + "/api/accounts/unlock";
const UPDATE_TOUR = REACT_APP_HOST + '/api/tours/updateTour'
const DELETE_TOUR = REACT_APP_HOST + '/api/tours/delete'
const UPDATE_BOOKING_STATUS = REACT_APP_HOST + '/api/bookings/updateStatus';
const UPLOAD_IMAGE = REACT_APP_HOST + '/api/tours/upload';
const WEB_SOCKET = REACT_APP_HOST + '/ws';
const GET_LINK_MOMO = REACT_APP_HOST + '/api/payment/momo/createLink';
const INIT_MOMO = 'https://test-payment.momo.vn/v2/gateway/api/create';
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

export default REACT_APP_HOST
export { GET_ALL_TOUR, CHECK_ACCOUNT_EXISTS, CHECK_USER_EXISTS, BOOKING_TOUR, GET_PAGE_BOOKING, 
    SEND_CODE_VERIFYCATION, VERIFY_CODE, LOGIN, REGISTER, RESET_PASSWORD, SEARCH, GET_TOUR_DETAIL,GET_EMAIL, 
    GET_PAGE_DESTINATION, POST_TOUR, UPDATE_TOUR, DELETE_TOUR, UPDATE_BOOKING_STATUS, UPLOAD_IMAGE,CHANGE_PASSWORD,
    ACCOUNT_UNLOCK,ACCOUNT_LOCK,GET_ACCOUNT,GET_USER, GET_NOTIFY, WEB_SOCKET, GET_LINK_MOMO, 
    INIT_MOMO, getAPI };
