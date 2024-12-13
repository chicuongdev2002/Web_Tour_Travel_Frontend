// src/api.js
import axios from "axios";
import { TOUR_GUIDE } from "../config/host";



export const fetchAssignmentsTourGuide = async (guideId) => {
  try {
    const response = await axios.get(`${TOUR_GUIDE}/${guideId}/assignments`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể tải danh sách tour. Vui lòng thử lại sau.");
  }
};
export const getAllTourGuide = async () => {
  try {
    const response = await axios.get(`${TOUR_GUIDE}`);
    return response;
  } catch (error) {
    throw new Error("Không thể tải danh sách tour. Vui lòng thử lại sau.");
  }
};
export const fetchKPITourGuide = async (guideId) => {
  try {
    const response = await axios.get(`${TOUR_GUIDE}/${guideId}/kpi`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể tải KPI. Vui lòng thử lại sau.");
  }
};

export const updateAssignmentStatusTourGuide = async (userId, departureId, newStatus) => {
  try {
    await axios.put(
      `${TOUR_GUIDE}/${userId}/assignments/${departureId}/status`,
      { status: newStatus },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new Error("Không thể cập nhật trạng thái. Vui lòng thử lại sau.");
  }
};