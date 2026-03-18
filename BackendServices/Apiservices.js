

import axios from 'axios';


export const BASE_URL = 'http://192.168.1.4:8000';


const api = axios.create({
  baseURL: BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 60000, 
});




export const createProperty = async (propertyData) => {
  try {
    console.log('📤 Sending property data to server...');
    
   
    const cleanData = JSON.parse(JSON.stringify(propertyData));
    
   
    const response = await api.post('/properties/', cleanData);
    
    console.log('✅ Property created!');
    return response.data;
  } catch (error) {
    console.log('❌ Create failed:', error.message);
    throw error;
  }
};

// GET all properties
export const getAllProperties = async () => {
  try {
    const response = await api.get('/properties/');
    return response.data;
  } catch (error) {
    console.log('❌ Failed to get properties:', error.message);
    throw error;
  }
};


export const getPropertyById = async (propertyId) => {
  try {
    const response = await api.get(`/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    console.log('❌ Failed to get property:', error.message);
    throw error;
  }
};


export const updateProperty = async (propertyId, propertyData) => {
  try {
    const cleanData = JSON.parse(JSON.stringify(propertyData));
    const response = await api.put(`/properties/${propertyId}`, cleanData);
    return response.data;
  } catch (error) {
    console.log('❌ Update failed:', error.message);
    throw error;
  }
};


export const deleteProperty = async (propertyId) => {
  try {
    const response = await api.delete(`/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    console.log('❌ Delete failed:', error.message);
    throw error;
  }
};

// ==================== USER APIs ====================

// SIGN UP new user
export const signupUser = async (userData) => {
  try {
    const response = await api.post('/users/signup', userData);
    return response.data;
  } catch (error) {
    console.log('❌ Signup failed:', error.message);
    throw error;
  }
};

// LOGIN user
export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/users/login', loginData);
    return response.data;
  } catch (error) {
    console.log('❌ Login failed:', error.message);
    throw error;
  }
};

// GET user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.log('❌ Failed to get user:', error.message);
    throw error;
  }
};
// UPDATE PROPERTY STATUS (PATCH) - For toggling active/status only
export const updatePropertyStatus = async (propertyId, statusData) => {
  try {
    // statusData should contain either/both:
    // { status: "active" } or { status: "inactive" } 
    // { isActive: true } or { isActive: false }
    
    const response = await api.patch(`/properties/${propertyId}/status`, statusData);
    return response.data;
  } catch (error) {
    console.log('❌ Status update failed:', error.message);
    throw error;
  }
};

export default api;