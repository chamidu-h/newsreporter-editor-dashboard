// src/services/api.js
import axios from 'axios';

const BASE_URL = "http://192.168.8.199:8080/";

const api = axios.create({
  baseURL: BASE_URL,
  responseType: "json",
});

// Export login function
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;  // Return only the payload
};


// Export function to get submitted articles
export const getSubmittedArticles = async () => {
  return api.get('/api/articles/submitted');
};

// Export function to get an article by ID
export const getArticleById = async (id) => {
  const response = await api.get(`/api/articles/${id}`);
  // If the response is wrapped, return the inner data
  return response.data.data || response.data;
};


// Export function to approve an article by ID
export const approveArticle = async (id) => {
  return api.put(`/api/articles/${id}/approve`);
};

// Export function to reject an article by ID with a comment
export const rejectArticle = async (id, comment) => {
  return api.put(`/api/articles/${id}/reject`, { comment });
};

export default api;
