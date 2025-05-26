//VITE_API_BACKEND=http://localhost:8000/api

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND,
  withCredentials: true,
});

api.defaults.headers.common['Accept'] = 'application/json';
api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default api;