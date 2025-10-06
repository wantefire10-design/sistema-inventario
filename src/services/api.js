import axios from 'axios';

// URL para desarrollo - SOLO conexión real
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.14:3000/api';

console.log('🌐 Conectando a:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// CRUD COMPLETO - SOLO datos reales
export const productService = {
  // CREATE - Crear producto
  create: async (productData) => {
    try {
      console.log('📝 Creando producto:', productData);
      const response = await api.post('/productos', productData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando producto:', error.message);
      throw new Error('No se pudo crear el producto: ' + error.message);
    }
  },

  // READ - Obtener productos
  getAll: async () => {
    try {
      console.log('📦 Obteniendo productos del backend...');
      const response = await api.get('/productos');
      console.log(`✅ ${response.data.length} productos cargados`);
      return response.data;
    } catch (error) {
      console.error('❌ Error cargando productos:', error.message);
      throw new Error('No se pudieron cargar los productos: ' + error.message);
    }
  },

  // READ - Obtener producto por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo producto:', error.message);
      throw new Error('No se pudo obtener el producto: ' + error.message);
    }
  },

  // UPDATE - Actualizar producto
  update: async (id, productData) => {
    try {
      console.log('✏️ Actualizando producto ID:', id);
      const response = await api.put(`/productos/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando producto:', error.message);
      throw new Error('No se pudo actualizar el producto: ' + error.message);
    }
  },

  // DELETE - Eliminar producto
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando producto ID:', id);
      const response = await api.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando producto:', error.message);
      throw new Error('No se pudo eliminar el producto: ' + error.message);
    }
  },

  // Obtener categorías
  getCategories: async () => {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      console.error('❌ Error cargando categorías:', error.message);
      throw new Error('No se pudieron cargar las categorías: ' + error.message);
    }
  }
};