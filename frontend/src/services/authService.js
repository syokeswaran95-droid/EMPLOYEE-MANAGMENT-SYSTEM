import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (data) => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/auth/users/');
    return response.data;
  }
};
