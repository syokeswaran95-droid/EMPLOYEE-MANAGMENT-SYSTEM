import api from './api';

export const attendanceService = {
  getAll: async (params = {}) => {
    const response = await api.get('/attendance/', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/attendance/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/attendance/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/attendance/${id}/`);
    return response.data;
  }
};
