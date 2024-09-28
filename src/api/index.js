import axios from "axios";
import storageController from '@/Controllers/Storage.controller';


// Criação da instância da API
const api = axios.create({
  baseURL: "https://noodletop.com.br/api/kurt/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token Bearer
api.interceptors.request.use((config) => {
  const token = storageController.getLocal('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
