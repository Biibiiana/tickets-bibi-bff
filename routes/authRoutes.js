const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Verificar que la clave secreta esté configurada
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
}

// Ruta de registro
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    // Validación básica
    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Todos los campos son requeridos',
            error: 'VALIDATION_ERROR'
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
                message: 'El usuario o email ya existe',
                error: 'DUPLICATE_USER'
            });
        }
        console.error('Error en registro:', error);
        res.status(500).json({
            message: 'Error al crear el usuario',
            error: error.message,
            code: 'SERVER_ERROR'
        });
    }
});

// Ruta de login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validación básica
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email y contraseña son requeridos',
                error: 'VALIDATION_ERROR'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Usuario no encontrado',
                error: 'USER_NOT_FOUND'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Contraseña incorrecta',
                error: 'INVALID_PASSWORD'
            });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            user, 
            token,
            message: 'Login exitoso'
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message,
            code: 'SERVER_ERROR'
        });
    }
});

module.exports = router;