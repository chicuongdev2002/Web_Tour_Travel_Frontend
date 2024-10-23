const REACT_APP_HOST = 'http://localhost:8080';
const GET_ALL_TOUR = REACT_APP_HOST + '/api/tours';
const GET_TOUR_DETAIL = REACT_APP_HOST + '/api/tours';
const getAPI = (api, params) => {
    let url = api + '?';
    for (const key in params) {
        url += key + '=' + params[key] + '&&';
    }
    return url;
}
export default REACT_APP_HOST
export { GET_ALL_TOUR,GET_TOUR_DETAIL, getAPI };