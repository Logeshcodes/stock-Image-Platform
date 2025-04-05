import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', 
  // baseURL: 'https://stock-image-platform-jeoi.vercel.app',
  withCredentials: true,  
});

export default api;
