
import axios from 'axios';
import { GET_USER,ACCOUNT_LOCK } from '../config/host';

export const getCustomers = async () => {
  try {
    const response = await axios.get(`${GET_USER}`);
    return response;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch customers' };
  }
};

export const updateCustomer = async (userId, customerData) => {
  try {
    const response = await axios.put(`${GET_USER}/${userId}`, customerData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating customer:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to update customer' };
  }
};
export const deleteUser = async (userId) => {
  try {
    const response = await axios.post(`${ACCOUNT_LOCK}/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating customer:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to update customer' };
  }
};

