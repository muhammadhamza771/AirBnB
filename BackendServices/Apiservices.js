import axios from 'axios';

const BASE_URL = 'http://192.168.1.6:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ==================== USER APIS ====================

export const signupUser = async (userData) => {
  const response = await api.post('/users/signup', userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await api.post('/users/login', loginData);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData, profileImage = null) => {
  try {
    if (profileImage) {
      const formData = new FormData();
      
      for (let key in userData) {
        if (userData[key] !== null && userData[key] !== undefined) {
          if (Array.isArray(userData[key])) {
            formData.append(key, JSON.stringify(userData[key]));
          } else {
            formData.append(key, String(userData[key]));
          }
        }
      }
      
      formData.append('profile_picture', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
      
      const response = await api.put(`/users/update_all_data/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      const response = await api.put(`/users/update_all_data/${userId}`, userData);
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

// ==================== FAMILY MEMBER APIS ====================

// ✅ GET all family members by user ID
export const getFamilyMembersByUserId = async (userId) => {
  try {
    const response = await api.get(`/family/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET single family member
export const getFamilyMember = async (familyId) => {
  try {
    const response = await api.get(`/family/member/${familyId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addFamilyMember = async (userId, memberData) => {
  try {
    const response = await api.post(`/family/${userId}`, memberData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFamilyMember = async (familyId, memberData) => {
  try {
    const response = await api.put(`/family/${familyId}`, memberData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFamilyMember = async (familyId) => {
  try {
    const response = await api.delete(`/family/${familyId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;