import axios from 'axios';

export const BASE_URL = 'http://192.168.1.6:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});



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




// // ==================== FAMILY MEMBER APIS ====================
// export const getFamilyMembersByUserId = async (userId) => {
//   try {
//     const response = await api.get(`/family/user/${userId}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const addFamilyMember = async (userId, memberData) => {
//   try {
//     const response = await api.post(`/family/${userId}`, memberData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };



export default api;