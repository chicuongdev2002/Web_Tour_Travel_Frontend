import axios from "axios";
import {
  STATIS_REVENUE_TOTAL,
  STATIS_REVENUE_TOUR_TICKET,
  STATIS_REVENUE_MONTHLY,
  getAPI,
} from "../config/host";
import { format } from "date-fns";

const fetchTotalRevenue = async (startDate, endDate) => {
  const url = getAPI(STATIS_REVENUE_TOTAL, null, null);
  console.log(
    `Fetching total revenue from ${url}startDate=${startDate}&endDate=${endDate}`,
  );
  const response = await axios.get(
    `${url}?startDate=${startDate}&endDate=${endDate}`,
  );
  return response.data;
};

const fetchTourRevenue = async (startDate, endDate) => {
  const url = getAPI(STATIS_REVENUE_TOUR_TICKET, null, null);
  const response = await axios.get(
    `${url}?startDate=${startDate}&endDate=${endDate}`,
  );
  return response.data;
};

const fetchMonthlyRevenue = async (year) => {
  const url = getAPI(STATIS_REVENUE_MONTHLY, null, null);
  const response = await axios.get(`${url}?year=${year}`);
  return response.data;
};

export { fetchTotalRevenue, fetchTourRevenue, fetchMonthlyRevenue };
