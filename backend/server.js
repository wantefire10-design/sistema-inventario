const express = require('express');
const cors = require('cors');
const { 
  getProducts, 
  getProductById, 
  getCategories,
  createProduct, 
  updateProduct, 
  deleteProduct
  // ⬇️ ELIMINA ESTA LÍNEA ⬇️
  // getLowStockProducts
} = require('./productController');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de productos
app.get('/api/productos', getProducts);
app.get('/api/productos/:id', getProductById);
app.get('/api/categorias', getCategories);
// ⬇️ ELIMINA ESTA RUTA ⬇️
// app.get('/api/productos-bajo-stock', getLowStockProducts);
app.post('/api/productos', createProduct);
app.put('/api/productos/:id', updateProduct);
app.delete('/api/productos/:id', deleteProduct);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});