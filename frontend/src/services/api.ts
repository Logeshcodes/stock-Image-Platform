import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:4000', 
  baseURL : 'https://stock-image-platform-backend.onrender.com',
  // baseURL: 'https://stock-image-platform-backend.onrender.com',
  withCredentials: true,  
});

export default api;
