import api from './axiosInstance';

export const getSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

export const getCategoryTotals = async () => {
  const response = await api.get('/dashboard/category-totals');
  return response.data;
};

export const getMonthlyTrends = async () => {
  const response = await api.get('/dashboard/monthly-trends');
  return response.data;
};

export const getRecentActivity = async () => {
  const response = await api.get('/dashboard/recent-activity');
  return response.data;
};
