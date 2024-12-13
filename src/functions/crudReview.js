import axios from "axios";
import {REVIEW_ALL,getAPI } from "../config/host";
// Thêm review mới
const addReview = async (reviewData) => {
  try {
    const url = getAPI(REVIEW_ALL);
    const response = await axios.post(url, reviewData);
    return response.data;
  } catch (error) {
    throw new Error("Không thể thêm đánh giá: " + error.message);
  }
};
// Xóa review
const deleteReview = async (reviewId) => {
  try {
    const url = getAPI(REVIEW_ALL, null, reviewId);
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    throw new Error("Không thể xóa đánh giá: " + error.message);
  }
};
// Cập nhật review
const updateReview = async (reviewId, reviewData) => {
  try {
    const url = getAPI(REVIEW_ALL, null, reviewId);
    const response = await axios.put(url, reviewData);
    return response.data;
  } catch (error) {
    throw new Error("Không thể cập nhật đánh giá: " + error.message);
  }
};
export {  addReview,deleteReview,updateReview};
