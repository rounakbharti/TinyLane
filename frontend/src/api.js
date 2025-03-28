import axios from 'axios';

const api = axios.create({
  baseURL: '/api/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const signup = async (credentials) => {
  return await api.post('auth/signup/', credentials);
};

export const login = async (credentials) => {
  return await api.post('auth/login/', credentials);
};

export const shortenUrl = async (data) => {
  return await api.post('urls/', data);
};

export const getUserUrls = async () => {
  return await api.get('urls/');
};

export const getUrlAnalytics = async (shortCode) => {
  return await api.get(`urls/${shortCode}/analytics/`);
};