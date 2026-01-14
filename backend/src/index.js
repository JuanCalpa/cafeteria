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

// CORS - Configuración para desarrollo
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://10.0.2.2:3000', 'http://192.168.100.80:3000'],
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
  console.log('🔧 Rutas API registradas:');
  console.log('  GET  /health');
  console.log('  GET  /api/verificarSesion');
  console.log('  POST /api/login');
  console.log('  POST /api/logout');
  console.log('  POST /api/registro');
  console.log('  GET  /api/products');
  console.log('  GET  /api/categories');
  console.log('  GET  /api/pedidosPanel');
  console.log('  GET  /api/pagosPanel');
  console.log('  POST /api/createComprobante');
  console.log('  GET  /api/getComprobanteFile/:id_confirmacion');
}

logRegisteredRoutes();

// Middleware para rutas API no encontradas (debe ir después de todas las rutas API)
app.use('/api', (req, res) => {
  console.log(`❌ Ruta API no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Ruta API no encontrada', 
    path: req.path, 
    method: req.method
  });
});

// ==================== FRONTEND ====================

// Servir archivos subidos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, '../../panelAdmin/frontend/dist')));

// Todas las rutas que NO sean /api deben servir el index.html de React
// Esto permite que React Router maneje las rutas del frontend
app.use((req, res, next) => {
  // Si la ruta NO empieza con /api, /health o /uploads
  if (!req.path.startsWith('/api') && !req.path.startsWith('/health') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(__dirname, '../../panelAdmin/frontend/dist/index.html'));
  } else {
    next();
  }
});

// ==================== SERVER ====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   🚀 SERVIDOR BACKEND INICIADO          ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Backend API: http://localhost:${PORT}`);
  console.log(`🌍 Red local:   http://10.0.2.2:${PORT} (Emulador Android)`);
  console.log('');
  console.log('📦 Sirviendo frontend desde: panelAdmin/frontend/dist');
  console.log('');
  console.log('🔧 Modo: Desarrollo');
  console.log('💾 Base de datos: MySQL (Railway)');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});