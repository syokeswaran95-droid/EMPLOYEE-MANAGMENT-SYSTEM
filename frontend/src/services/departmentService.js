import api from './api';

export const departmentService = {
  getDepartments: async () => {
    const response = await api.get('/departments/');
    return response.data;
  },
  createDepartment: async (data) => {
    const response = await api.post('/departments/', data);
    return response.data;
  },
  updateDepartment: async (id, data) => {
    const response = await api.patch(`/departments/${id}/`, data);
    return response.data;
  },
  deleteDepartment: async (id) => {
    const response = await api.delete(`/departments/${id}/`);
    return response.data;
  },
  getPositions: async (params = {}) => {
    const response = await api.get('/positions/', { params });
    return response.data;
  },
  createPosition: async (data) => {
    const response = await api.post('/positions/', data);
    return response.data;
  },
  updatePosition: async (id, data) => {
    const response = await api.patch(`/positions/${id}/`, data);
    return response.data;
  },
  deletePosition: async (id) => {
    const response = await api.delete(`/positions/${id}/`);
    return response.data;
  }
};
