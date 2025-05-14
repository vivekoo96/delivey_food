import api from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    // console.log(response.data);
    
    return {
      token: response.data.token,
      user: response.data
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};