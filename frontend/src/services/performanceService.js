import api from './api';

export const performanceService = {
  getAll: async (params = {}) => {
    const response = await api.get('/performance/', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/performance/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/performance/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/performance/${id}/`);
    return response.data;
  }
};
