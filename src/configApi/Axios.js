//VITE_API_BACKEND=http://back.test/api

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND,
  withCredentials: true,
});

api.defaults.xsrfCookieName = 'XSRF-TOKEN'
api.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api;
