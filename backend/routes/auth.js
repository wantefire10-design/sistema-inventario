const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/database');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // --- CORRECCIÓN: Seleccionamos el campo 'rol' ---
    const [users] = await connection.promise().query(
      'SELECT id, username, nombre, email, password, rol FROM usuarios WHERE username = ? AND activo = TRUE',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = users[0];

    // Compara la contraseña (asumiendo que usas bcrypt)
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // --- CORRECCIÓN: Incluimos el 'rol' en el token ---
    const payload = {
      id: user.id,
      username: user.username,
      rol: user.rol // ¡Importante!
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        username: user.username,
        rol: user.rol // Enviamos el rol al frontend
      }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;