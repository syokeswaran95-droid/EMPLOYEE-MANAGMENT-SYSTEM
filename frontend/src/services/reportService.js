import api from './api';

export const reportService = {
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/');
    return response.data;
  },
  getReports: async () => {
    const response = await api.get('/reports/');
    return response.data;
  }
};
