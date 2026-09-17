import api from './api';

export const leaveService = {
  getAll: async (params = {}) => {
    const response = await api.get('/leaves/', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/leaves/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/leaves/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/leaves/${id}/`);
    return response.data;
  }
};
