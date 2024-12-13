import axios from 'axios';
import { GET_DISCOUNT_TOUR } from '../config/host';

export const sendDiscountCode = async (selectedEmails,discountIds) => {
 try {
     const response = await axios.post(
        `${GET_DISCOUNT_TOUR}/send-discount-code`,
        {
          emails: selectedEmails,
          discountIds: discountIds,
        },
      );
   return response;
 } catch (error) {
  
 }
};
export const getDiscount = async () => {
  try {
    const response = await axios.get(`${GET_DISCOUNT_TOUR}`);
    return {success:true,data:response.data};
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to fetch discount' };
  }
};
export const createDiscount = async (data) => {
  try {
    const response = await axios.post(`${GET_DISCOUNT_TOUR}`, data);
    return { success: true, data: response.data,message:"Tạo mã khuyến mãi thành công" };
  } catch (error) {
    console.error("Error creating discount:", error);
    return { success: false, error: error.response?.data?.message || 'Failed to create discount' };
  }
};

export const updateDiscount = async (id, data) => {
  try {
    const response = await axios.put(`${GET_DISCOUNT_TOUR}/${id}`, data);
    return { success: true, data: response.data, message:"Cập nhật mã khuyến mãi thành công"};
  } catch (error) {
    console.error("Error updating discount:", error);
    return { success: false, error: error.response?.data?.message || 'Failed to update discount' };
  }
};

export const deleteDiscount = async (id) => {
  try {
    await axios.delete(`${GET_DISCOUNT_TOUR}/${id}`);
    return { success: true ,message:"Xóa mã khuyến mãi thành công"};
  } catch (error) {
    console.error("Error deleting discount:", error);
    return { success: false, error: error.response?.data?.message || 'Failed to delete discount' };
  }
};

