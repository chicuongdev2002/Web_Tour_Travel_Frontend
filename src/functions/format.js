import { format } from "date-fns";
import { vi } from "date-fns/locale";

const formatMoney = (amount) => {
  let amountString = amount + "";
  if (amountString.length <= 3) {
    return amountString;
  }
  return `${(amount / 100).toFixed(3)}`;
};

const formatMoneyVND = (amount) => {
  let amountString = amount + "";
  if (amountString.length <= 3) {
    return amountString + " VND";
  }
  for (let i = amountString.length - 3; i > 0; i -= 3) {
    amountString = amountString.slice(0, i) + "," + amountString.slice(i);
  }
  return amountString + " VND";
};

const formatDate = (date) => {
  if (!date) return "";
  const formattedDate = format(
    new Date(date),
    "HH:mm eeee, 'ngày' dd 'tháng' MM 'năm' yyyy",
    { locale: vi },
  );
  return formattedDate;
};

const convertISOToCustomFormat = (isoDate) => {
  const date = new Date(isoDate);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

const getTimeDifference = (isoDate) => {
  const inputDate = new Date(isoDate);
  const currentDate = new Date();
  const diffInMs = currentDate - inputDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày`;
  } else {
    return `${Math.floor(diffInDays / 7)} tuần`;
  }
};

export {
  formatMoney,
  formatMoneyVND,
  formatDate,
  convertISOToCustomFormat,
  getTimeDifference,
};
