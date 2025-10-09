// backend/src/index.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const productosRouter = require('./routes/productosRouter');
const loginRouter = require('./routes/loginRouter');
const usuarioRouter = require('./routes/usuariosRouter');

const app = express();

// 🔹 Middleware base
app.use(express.json());

// 🔹 Configuración de sesión
app.use(session({
  secret: 'Cafeteria321',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 600000 }
}));

// 🔹 CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// 🔹 Verificar sesión (debe ir antes de las rutas protegidas)
app.get('/api/verificarSesion', (req, res) => {
  if (req.session && req.session.usuario) {
    res.json({ usuario: req.session.usuario });
  } else {
    res.status(401).json({ mensaje: 'No autenticado' });
  }
});

// 🔹 Rutas API
app.use('/productos', productosRouter);
app.use('/api', loginRouter);
app.use('/api', usuarioRouter);

// 🔹 Servir frontend del panel
app.use('/panelAdmin', express.static(path.join(__dirname, '../../panelAdmin')));

// 🔹 Ruta principal (login)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../panelAdmin/frontend/index.html'));
});

// 🔹 Servir paneles directamente
app.get('/panelAdmin/frontend/panel.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../panelAdmin/frontend/panel.html'));
});

app.get('/panelAdmin/frontend/panelCocina.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../panelAdmin/frontend/panelCocina.html'));
});

// 🔹 Iniciar servidor
app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});
