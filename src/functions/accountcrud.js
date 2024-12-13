import axios from 'axios';
import { GET_ACCOUNT } from '../config/host';
import axiosInstance from '../config/axios';
export const getAccount = async (page = 0, pageSize = 5, roleFilter = '', statusFilter = '') => {
  try {
    const response = await axiosInstance.get(`${GET_ACCOUNT}`, {
      params: {
        page,
        size: pageSize,
        role: roleFilter,
        status: statusFilter,
      },
    });
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch accounts' 
    };
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(`${GET_ACCOUNT}/${userId}`);
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('Error fetching user details:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch user details' 
    };
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    await axios.post(`${GET_ACCOUNT}/upgrade/${userId}/${newRole}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating role:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to update role' 
    };
  }
};

export const updateAccountStatus = async (userIds, action) => {
  try {
    await Promise.all(
      userIds.map((userId) => {
        const endpoint = action === 'lock' 
          ? `${GET_ACCOUNT}/lock/${userId}` 
          : `${GET_ACCOUNT}/unlock/${userId}`;
        return axios.post(endpoint);
      })
    );
    return { success: true };
  } catch (error) {
    console.error(`Error ${action}ing accounts:`, error);
    return { 
      success: false, 
      error: error.response?.data?.message || `Failed to ${action} accounts` 
    };
  }
};

export const addAccount = async (accountData) => {
  try {
    console.log('accountData:', accountData);
    const response = await axios.post(`${GET_ACCOUNT}/register`, accountData);
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('Error adding account:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to add account' 
    };
  }
};

export const resetPasswords = async (userIds) => {
  try {
    await axios.post(`${GET_ACCOUNT}/admin-reset-password`, { userIds });
    return { success: true };
  } catch (error) {
    console.error('Error resetting passwords:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to reset passwords' 
    };
  }
};
export const deleteAccount = async (userIds) => {
  try {
    await axios.delete(`${GET_ACCOUNT}`, { userIds });
    return { success: true };
  } catch (error) {
    console.error('Error resetting passwords:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to reset passwords' 
    };
  }
};
export const updateAccount = async (editedUserDetails) => {
  try {
      const response = await fetch(GET_ACCOUNT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUserDetails),
      });
      return response
  } catch (error) {
    return { 
      error: error.response?.data?.message || 'Failed to reset passwords' 
    };
  }
};