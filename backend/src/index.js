// backend/src/index.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const productosRouter = require('./routes/productosRouter');
const pedidosRouter = require('./routes/pedidosRouter'); 
const loginRouter = require('./routes/loginRouter');
const usuarioRouter = require('./routes/usuariosRouter');
const comprobanteRouter = require('./routes/comprobanteRouter');

const app = express();

// ==================== MIDDLEWARES ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión
app.use(session({
  secret: 'Cafeteria321',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 600000 }
}));

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ==================== RUTAS API ====================

// Endpoint de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Verificar sesión (antes de las rutas protegidas)
app.get('/api/verificarSesion', (req, res) => {
  if (req.session && req.session.usuario) {
    res.json({ usuario: req.session.usuario });
  } else {
    res.status(401).json({ mensaje: 'No autenticado' });
  }
});

// Conectar rutas principales
app.use('/api', loginRouter);
app.use('/api', usuarioRouter);
app.use('/api', pedidosRouter);
app.use('/api', productosRouter);
app.use('/api', comprobanteRouter);

// Debug: Log de rutas registradas
console.log('🔧 Rutas registradas:');
console.log('  /health');
console.log('  /api/verificarSesion');
console.log('  /api/login (POST)');
console.log('  /api/logout (POST)');
console.log('  /api/registro (POST)');
console.log('  /api/products (GET)');
console.log('  /api/categories (GET)');
console.log('  /api/categories/:categoryName/products (GET)');
console.log('  /api/products/search (GET)');

// Middleware para rutas API no encontradas (debe ir después de todas las rutas)
app.use('/api', (req, res) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Ruta no encontrada', path: req.path, method: req.method });
});

// ==================== FRONTEND ====================

// Servir frontend del panel
app.use('/panelAdmin', express.static(path.join(__dirname, '../../panelAdmin')));

// Ruta principal (login)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../panelAdmin/frontend/index.html'));
});

// Servir paneles
app.get('/panelAdmin/frontend/panel.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../panelAdmin/frontend/panel.html'));
});

app.get('/panelAdmin/frontend/panelCocina.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../panelAdmin/frontend/panelCocina.html'));
});

// servir archivos subidos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==================== SERVER ====================
app.listen(3000, '0.0.0.0', () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});
