import api from './axiosInstance';

export const getRecords = async (filters) => {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.category) params.append('category', filters.category);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  params.append('page', filters.page || 0);
  params.append('size', filters.size || 10);
  
  const response = await api.get(`/records?${params.toString()}`);
  return response.data;
};

export const getRecordById = async (id) => {
  const response = await api.get(`/records/${id}`);
  return response.data;
};

export const createRecord = async (data) => {
  const response = await api.post('/records', data);
  return response.data;
};

export const updateRecord = async (id, data) => {
  const response = await api.put(`/records/${id}`, data);
  return response.data;
};

export const deleteRecord = async (id) => {
  const response = await api.delete(`/records/${id}`);
  return response.data;
};
