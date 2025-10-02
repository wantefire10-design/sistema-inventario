const express = require('express');
const connection = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los productos
router.get('/', verifyToken, async (req, res) => {
  try {
    const [productos] = await connection.promise().query(`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.activo = TRUE
      ORDER BY p.nombre
    `);
    
    res.json(productos);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener un producto por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [productos] = await connection.promise().query(`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.id = ? AND p.activo = TRUE
    `, [req.params.id]);
    
    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(productos[0]);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST - Crear nuevo producto (solo admin)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, stock_minimo, categoria_id, codigo_barras } = req.body;
    
    const [result] = await connection.promise().query(
      `INSERT INTO productos 
       (nombre, descripcion, precio, stock, stock_minimo, categoria_id, codigo_barras) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, stock, stock_minimo, categoria_id, codigo_barras]
    );
    
    // Obtener el producto recién creado
    const [productos] = await connection.promise().query(
      'SELECT * FROM productos WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto: productos[0]
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT - Actualizar producto (solo admin)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, stock_minimo, categoria_id, codigo_barras } = req.body;
    
    const [result] = await connection.promise().query(
      `UPDATE productos 
       SET nombre = ?, descripcion = ?, precio = ?, stock = ?, stock_minimo = ?, 
           categoria_id = ?, codigo_barras = ?, fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [nombre, descripcion, precio, stock, stock_minimo, categoria_id, codigo_barras, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE - Eliminar producto (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [result] = await connection.promise().query(
      'UPDATE productos SET activo = FALSE WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener categorías
router.get('/categorias/list', verifyToken, async (req, res) => {
  try {
    const [categorias] = await connection.promise().query(
      'SELECT * FROM categorias WHERE activa = TRUE ORDER BY nombre'
    );
    
    res.json(categorias);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;