const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Mostrar formulario (GET)
router.get('/register', (req, res) => {
  res.render('signup');
});

// Guardar usuario (POST)
router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena, rol} = req.body; 

  try {
    await db.execute({
      sql: `INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)`,
      args: [nombre, correo, contrasena, rol]
    });

    res.redirect('home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar usuario');
  }
});

// GET: Render users as cards
router.get('/cards', async (req, res) => {
    try {
      const result = await db.execute('SELECT * FROM usuarios');
      const usuarios = result.rows;
      res.render('users', { usuarios });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error loading users');
    }
  });

// Show edit form
router.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const result = await db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (result.rows.length === 0) return res.status(404).send('Usuario no encontrado');
    res.render('edit', { usuario: result.rows[0] });
  });

// Update user
router.post('/update/:id', async (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    await db.execute(
      'UPDATE usuarios SET nombre = ?, correo = ?, contrasena = ?, rol = ? WHERE id = ?',
      [nombre, correo, contrasena, rol, req.params.id]
    );
    res.redirect('../cards');
  });

  // Delete user
router.post('/delete/:id', async (req, res) => {
    await db.execute('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    res.redirect('../cards');
  });

  // GET for login form submission
  router.get('/verify', async (req, res) => {
    const { correo, contrasena } = req.query;
  
    try {
      const result = await db.execute({
        sql: 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?',
        args: [correo, contrasena],
      });
  
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const rol = user.rol.toLowerCase(); // Asegura comparación consistente
         // Guarda en sesión
      req.session.user = {
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      };
        switch (rol) {
          case 'alumno':
            res.render('bienvenida_estudiante', { nombre: user.nombre });
            break;
          case 'profesor':
            res.render('bienvenida_profesor', { nombre: user.nombre });
            break;
          case 'admin':
            res.redirect('/cards');
            break;
          default:
            res.status(403).send('Rol no reconocido');
        }
      } else {
        res.status(401).send('<h2>Correo o contraseña inválidos</h2><a href="/login">Intentar de nuevo</a>');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al validar el usuario.');
    }
  });

module.exports = router;
