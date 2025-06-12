const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const cors = require('cors');
const jwt = require('jsonwebtoken');

mongoose.connection.on('connected', () => {
  console.log('Conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Desconectado de MongoDB');
});

// Middleware de autenticación
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Por favor, autentícate' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = decoded;
    next();
  });
};

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const concertRoutes = require('./routes/concertRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
app.listen(8080, '0.0.0.0', () => {
  console.log('Server running on port 8080');
});

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para CORS
const allowedOrigins = [
  'http://localhost:5173', // Vue.js development
  'https://ticketsb.netlify.app' // Tu dominio de Netlify
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(cors({
  origin: 'http://localhost:5173', // Puerto predeterminado de Vue.js
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/tickets', ticketRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
