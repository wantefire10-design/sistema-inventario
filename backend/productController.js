const connection = require('./config/database');

// GET - Obtener todos los productos con categorías
const getProducts = (req, res) => {
  const query = `
    SELECT p.*, c.nombre as categoria_nombre 
    FROM productos p 
    LEFT JOIN categorias c ON p.categoria_id = c.id 
    WHERE p.activo = 1
  `;
  
  console.log('📦 Ejecutando query para obtener productos...');
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error en getProducts:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(`✅ Productos obtenidos: ${results.length}`);
    res.json(results);
  });
};

// GET - Obtener un producto por ID
const getProductById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.*, c.nombre as categoria_nombre 
    FROM productos p 
    LEFT JOIN categorias c ON p.categoria_id = c.id 
    WHERE p.id = ? AND p.activo = 1
  `;
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(results[0]);
  });
};

// GET - Obtener todas las categorías
const getCategories = (req, res) => {
  const query = 'SELECT * FROM categorias';
  
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
};

// POST - Crear nuevo producto
const createProduct = (req, res) => {
  const { 
    codigo, 
    nombre, 
    descripcion, 
    precio_compra, 
    precio_venta, 
    stock, 
    stock_minimo, 
    categoria_id 
  } = req.body;

  console.log('📝 Creando producto:', { codigo, nombre });

  const query = `
    INSERT INTO productos 
    (codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, categoria_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  connection.query(query, [
    codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, categoria_id
  ], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'El código del producto ya existe' });
        return;
      }
      res.status(500).json({ error: err.message });
      return;
    }

    console.log(`✅ Producto creado con ID: ${results.insertId}`);

    // Registrar movimiento de entrada
    const movimientoQuery = `
      INSERT INTO movimientos (producto_id, tipo, cantidad, motivo, usuario) 
      VALUES (?, 'ENTRADA', ?, 'Creación de producto', 'sistema')
    `;
    
    connection.query(movimientoQuery, [results.insertId, stock], (movErr) => {
      if (movErr) {
        console.error('Error registrando movimiento:', movErr);
      }
      
      res.json({ 
        id: results.insertId,
        message: 'Producto creado exitosamente'
      });
    });
  });
};

// PUT - Actualizar producto
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { 
    codigo, 
    nombre, 
    descripcion, 
    precio_compra, 
    precio_venta, 
    stock, 
    stock_minimo, 
    categoria_id 
  } = req.body;

  console.log('✏️ Actualizando producto ID:', id);

  const query = `
    UPDATE productos 
    SET codigo = ?, nombre = ?, descripcion = ?, precio_compra = ?, 
        precio_venta = ?, stock = ?, stock_minimo = ?, categoria_id = ? 
    WHERE id = ?
  `;
  
  connection.query(query, [
    codigo, nombre, descripcion, precio_compra, precio_venta, 
    stock, stock_minimo, categoria_id, id
  ], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'El código del producto ya existe' });
        return;
      }
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json({ message: 'Producto actualizado exitosamente' });
  });
};

// DELETE - Eliminar producto (eliminación lógica)
const deleteProduct = (req, res) => {
  const { id } = req.params;
  
  console.log('🗑️ Eliminando producto ID:', id);

  const query = 'UPDATE productos SET activo = 0 WHERE id = ?';
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  });
};

// GET - Productos con stock bajo
const getLowStockProducts = (req, res) => {
  const query = `
    SELECT p.*, c.nombre as categoria_nombre 
    FROM productos p 
    LEFT JOIN categorias c ON p.categoria_id = c.id 
    WHERE p.stock <= p.stock_minimo AND p.activo = 1
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
};