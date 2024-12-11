const REACT_APP_HOST = "http://localhost:8080";
const GET_ALL_TOUR = REACT_APP_HOST + "/api/tours";
const GET_TOUR_PAGE = REACT_APP_HOST + "/api/tours/page";
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
const GET_PAGE_BOOKING = REACT_APP_HOST + "/api/bookings/page/has-price";
const GET_PAGE_DESTINATION = REACT_APP_HOST + "/api/destinations/page";
const POST_TOUR = REACT_APP_HOST + "/api/tours/addTour";
const CHANGE_PASSWORD = REACT_APP_HOST + "/api/accounts/change-password";
const GET_USER = REACT_APP_HOST + "/api/users";
const GET_ACCOUNT = REACT_APP_HOST + "/api/accounts";
const ACCOUNT_LOCK = REACT_APP_HOST + "/api/accounts/lock";
const ACCOUNT_UNLOCK = REACT_APP_HOST + "/api/accounts/unlock";
const DELETE_TOUR = REACT_APP_HOST + "/api/tours/delete";
const GET_TOUR_MANAGER = REACT_APP_HOST + "/api/tours/list-tours";
const GET_TOUR_PROVIDER = REACT_APP_HOST + "/api/tours/provider";
const APPROVE_TOUR = REACT_APP_HOST + "/api/tours/approve";
const GET_ALL_TOUR_TEST = REACT_APP_HOST + "/api/tours/test";
const STATIS_REVENUE_TOTAL = REACT_APP_HOST + "/api/tours/revenue-statistics";
const STATIS_REVENUE_TOUR_TICKET =
  REACT_APP_HOST + "/api/tours/revenue-statistics-tour-and-ticket";
const STATIS_REVENUE_MONTHLY = REACT_APP_HOST + "/api/tours/monthly-revenue";
const STATIS_TOUR_REVIEW = REACT_APP_HOST + "/api/reviews/statistics-tour-review";
const REVIEW_MONTHLY_STATIS = REACT_APP_HOST + "/api/reviews/monthly-statistics";
const UPDATE_TOUR = REACT_APP_HOST + '/api/tours/updateTour'
const UPDATE_TOUR_STATUS = REACT_APP_HOST + '/api/tours/updateStatus'
const UPDATE_BOOKING_STATUS = REACT_APP_HOST + '/api/bookings/updateStatus';
const UPLOAD_IMAGE = REACT_APP_HOST + '/api/tours/upload';
const WEB_SOCKET = REACT_APP_HOST + '/ws';
const GET_LINK_MOMO = REACT_APP_HOST + '/api/payment/momo';
const GET_TOUR_IN_DAY = REACT_APP_HOST + '/api/departures/inDay';
const GET_PAYMENT_BY_BOOKING = REACT_APP_HOST + '/api/payment/booking'
const GET_TOUR_TYPE = REACT_APP_HOST + '/api/tours/tourType'
const GET_BOOKING = REACT_APP_HOST + '/api/bookings/getBookingById'
const CANCEL_BOOKING = REACT_APP_HOST + '/api/bookings/cancelBooking'
const POST_DESTINATION = REACT_APP_HOST + "/api/destinations/addDestination";
const API_CHAT = 'https://api.dify.ai/v1/chat-messages';
const TOKEN_CHAT = 'Bearer app-vvW7w3XIvr5tcfWlRnuyCvoV';
const REVIEW_ALL = REACT_APP_HOST + "/api/reviews";
const ATTENDANCE=REACT_APP_HOST+ "/api/tour-guides/attendance"
const TOURGUIDE_SCHEDULE=REACT_APP_HOST+ "/api/tour-guides/schedule"
const FAVORITE_TOUR=REACT_APP_HOST+ "/api/favorite-tours"
const TOUR_GUIDE_ASSIGNMENT=REACT_APP_HOST+ "/api/tour-guides/assignments-all"
const TOUR_GUIDE=REACT_APP_HOST+ "/api/tour-guides"
const GET_DISCOUNT_TOUR=REACT_APP_HOST+ "/api/discounts"
const ITINERARY_BOOKING_TOUR=REACT_APP_HOST+ "/api/bookings/itinerary"
const TOUR_SIMPLE=REACT_APP_HOST+ "/api/tours/simple"
const TOUR_PROVIDER_DETAILS=REACT_APP_HOST+ "/api/tours/count-by-user"
const REVIEW_USER_STATISTICS=REACT_APP_HOST+ "/api/reviews/user-statistics"
const LOGIN_WITH_EMAIL=REACT_APP_HOST+ "/api/accounts/login-with-email"
const GET_ALL_DEPARTURE = REACT_APP_HOST + "/api/tours/allWithDeparture";
const ASSIGNMENT_TOURGUIDE=REACT_APP_HOST+ "/api/tour-guides/assign-tour-guide"
const BOOKING_DETAIL=REACT_APP_HOST+ "/api/bookings/user"
const REFRESH_TOKEN_ENDPOINT = REACT_APP_HOST + "/api/accounts/refresh-token";
const LOG_OUT = REACT_APP_HOST + "/api/accounts/logout"
const getAPI = (api, params, paramId) => {
  if (paramId) {
    api += "/" + paramId;
  }
  if (params === null) return api;
  let url = api + "?";
  for (const key in params) {
    url += key + "=" + params[key] + "&&";
  }
  return url;
};

export default REACT_APP_HOST
export { REACT_APP_HOST,GET_ALL_TOUR, CHECK_ACCOUNT_EXISTS, CHECK_USER_EXISTS, BOOKING_TOUR, GET_PAGE_BOOKING, 
    SEND_CODE_VERIFYCATION, VERIFY_CODE, LOGIN, REGISTER, RESET_PASSWORD, SEARCH, GET_TOUR_DETAIL,GET_EMAIL, 
    GET_PAGE_DESTINATION, POST_TOUR, UPDATE_TOUR, UPDATE_TOUR_STATUS, UPDATE_BOOKING_STATUS, UPLOAD_IMAGE,CHANGE_PASSWORD,
    ACCOUNT_UNLOCK,ACCOUNT_LOCK,GET_ACCOUNT,GET_USER, GET_NOTIFY, WEB_SOCKET, GET_LINK_MOMO, 
    GET_TOUR_PAGE, GET_TOUR_IN_DAY, GET_PAYMENT_BY_BOOKING,DELETE_TOUR,GET_TOUR_MANAGER,APPROVE_TOUR,
    STATIS_REVENUE_TOUR_TICKET,
    STATIS_REVENUE_MONTHLY,
    STATIS_TOUR_REVIEW,
    REVIEW_MONTHLY_STATIS,
    STATIS_REVENUE_TOTAL,
    GET_ALL_TOUR_TEST, GET_TOUR_TYPE, GET_BOOKING, CANCEL_BOOKING, POST_DESTINATION, API_CHAT,
    TOKEN_CHAT,REVIEW_ALL,
  ATTENDANCE,
  TOURGUIDE_SCHEDULE,
  GET_TOUR_PROVIDER,
  FAVORITE_TOUR,
  TOUR_GUIDE_ASSIGNMENT,
  TOUR_GUIDE,GET_DISCOUNT_TOUR,ITINERARY_BOOKING_TOUR,TOUR_SIMPLE, TOUR_PROVIDER_DETAILS,REVIEW_USER_STATISTICS,LOGIN_WITH_EMAIL,GET_ALL_DEPARTURE,ASSIGNMENT_TOURGUIDE,BOOKING_DETAIL,REFRESH_TOKEN_ENDPOINT,LOG_OUT,getAPI };
