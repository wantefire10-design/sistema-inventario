import axios from 'axios';

// Configurar la base URL de tu API
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para agregar el token a las peticiones
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // En React Native usaremos AsyncStorage después
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Servicios de Autenticación
export const authAPI = {
  login: (username, password) => API.post('/auth/login', { username, password }),
};

// Servicios de Productos
export const productosAPI = {
  getAll: () => API.get('/productos'),
  getById: (id) => API.get(`/productos/${id}`),
  create: (producto) => API.post('/productos', producto),
  update: (id, producto) => API.put(`/productos/${id}`, producto),
  delete: (id) => API.delete(`/productos/${id}`),
  getCategorias: () => API.get('/productos/categorias/list'),
};

export default API;