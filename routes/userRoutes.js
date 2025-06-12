const express = require('express');
const router = express.Router();
const User = require('../models/User');


// Ruta de registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validación básica
  if (!username || !email || !password) {
    return res.status(400).json({
      message: 'Todos los campos son requeridos'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user'
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'El usuario o email ya existe'
      });
    }
    res.status(500).json({
      message: 'Error al crear el usuario',
      error
    });
  }
});

// Obtener datos del usuario que inició sesión
// router.post('/login', async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     if (user && await bcrypt.compare(req.body.password, user.password)) {
//       res.json(user);
//     } else {
//       res.status(401).json({ message: 'Credenciales incorrectas' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;