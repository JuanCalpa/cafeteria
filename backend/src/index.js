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

// CORS - Configuración más permisiva para desarrollo
app.use(cors({
  origin: ['http://localhost:3000', 'http://10.0.2.2:3000'],
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
function logRegisteredRoutes() {
  console.log('🔧 Rutas registradas:');
  
  // Rutas directas
  console.log('  /health');
  console.log('  /api/verificarSesion');
  
  // Rutas de los routers
  const routes = [
    '/api/login (POST)',
    '/api/logout (POST)', 
    '/api/registro (POST)',
    '/api/products (GET)',
    '/api/categories (GET)',
    '/api/categories/:categoryName/products (GET)',
    '/api/products/search (GET)',
    '/api/createComprobante (POST)',
    '/api/getComprobante/:id_confirmacion (GET)',
    '/api/getComprobanteFile/:id_confirmacion (GET)'
  ];
  
  routes.forEach(route => console.log('  ' + route));
}

logRegisteredRoutes();

// Middleware para rutas API no encontradas (debe ir después de todas las rutas)
app.use('/api', (req, res) => {
  console.log(`❌ Ruta API no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Ruta API no encontrada', 
    path: req.path, 
    method: req.method,
    availableRoutes: [
      '/health',
      '/api/verificarSesion',
      '/api/login',
      '/api/logout',
      '/api/registro',
      '/api/products',
      '/api/categories',
      '/api/createComprobante'
    ]
  });
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
  console.log('🌍 Accesible desde: http://10.0.2.2:3000 (Emulador Android)');
});