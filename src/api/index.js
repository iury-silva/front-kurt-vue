import axios from "axios";
import storageController from '@/Controllers/Storage.controller';
import util from '@/Controllers/Util.controller';


// Criação da instância da API
const api = axios.create({
  baseURL: "https://noodletop.com.br/api/kurt/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token Bearer
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, (error) => {
  console.error('Erro na requisição: ', error);
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const errorResponse = error.response.data;
  console.log('Erro na resposta: ', errorResponse);
  if (Array.isArray(errorResponse.message)) {
    errorResponse.message.forEach((message) => {
      util.setNotification('error', message);
    });
  } else {
    util.setNotification('error', errorResponse.message);
  }
  return Promise.reject(error);
});

export default api;
