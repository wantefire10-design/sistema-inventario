const express = require('express');
const connection = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// =================================================================
// RUTAS GET (LECTURA) - Sin cambios
// =================================================================

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

// =================================================================
// RUTAS CUD (ESCRITURA) - CORREGIDAS PARA LA BASE DE DATOS REAL
// =================================================================

// POST - Crear nuevo producto (solo admin)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // CAMBIO: Se ajustan los campos a la base de datos
    const { codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, categoria_id } = req.body;
    
    // Llamada al Stored Procedure con la acción 'CREAR' y los parámetros correctos
    await connection.promise().query(
      'CALL sp_GestionarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['CREAR', null, codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, categoria_id]
    );
    
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT - Actualizar producto (solo admin)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // CAMBIO: Se ajustan los campos a la base de datos
    const { codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, categoria_id } = req.body;
    const { id } = req.params;

    // Llamada al Stored Procedure con la acción 'ACTUALIZAR' y los parámetros correctos
    await connection.promise().query(
      'CALL sp_GestionarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['ACTUALIZAR', id, codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, categoria_id]
    );
    
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE - Eliminar producto (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // CAMBIO: Se ajusta el número de parámetros NULL para que coincida con el SP
    await connection.promise().query(
      'CALL sp_GestionarProducto(?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)',
      ['ELIMINAR', id]
    );
    
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener categorías (Sin cambios)
router.get('/categorias/list', verifyToken, async (req, res) => {
  try {
    const [categorias] = await connection.promise().query(
      'SELECT * FROM categorias ORDER BY nombre'
    );
    
    res.json(categorias);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;