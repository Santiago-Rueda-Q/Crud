//VITE_API_BACKEND=http://localhost:8000/api

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND,
  withCredentials: true,
});

api.defaults.headers.common['Accept'] = 'application/json';
api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

//Interceptor de solicitud
/*api.interceptors.request.use(config => {
  console.log(`Solicitud enviada a: ${config.url}`);
  return config;
}, error => {
  console.error('Error en la solicitud:', error);
  return Promise.reject(error);
});*/

//Interceptor de respuesta
/* api.interceptors.response.use(response => {
  return response;
}, error => {
  console.error('Error en la respuesta:', error.response?.data);
  return Promise.reject(error);
});
 */
export default api;