const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración mejorada de CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

// Configuración de conexión a Railway
const dbConfig = {
  host: process.env.MYSQLHOST || 'turntable.proxy.rlwy.net',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'WvbFnAMNeMEoDYPzChTewVZoLAgfcqvG',
  database: process.env.MYSQLDATABASE || 'railway',
  port: process.env.MYSQLPORT || 40946
};

// Función para conectar a la base de datos
async function connectDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado a la base de datos de Railway');
    
    // Verificar que la tabla existe
    const [tables] = await connection.execute('SHOW TABLES LIKE "Productos"');
    if (tables.length === 0) {
      console.error('❌ La tabla "Productos" no existe en la base de datos');
    } else {
      console.log('✅ Tabla "Productos" encontrada');
    }
    
    return connection;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    throw error;
  }
}

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Backend de Cafetería Universidad Mariana funcionando',
    version: '1.0.0',
    database: {
      host: dbConfig.host,
      database: dbConfig.database,
      status: 'connected'
    }
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbConfig.host,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta para obtener categorías únicas desde los productos
app.get('/api/categories', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    
    const [rows] = await connection.execute(
      `SELECT DISTINCT categoria as name, 
       CASE 
         WHEN categoria = 'ALMUERZOS' THEN 'restaurant'
         WHEN categoria = 'BEBIDAS' THEN 'local_drink'
         WHEN categoria = 'BEBIDAS PROPIAS' THEN 'coffee'
         WHEN categoria = 'COMIDA RÁPIDA' THEN 'fastfood'
         WHEN categoria = 'DESAYUNOS' THEN 'breakfast_dining'
         WHEN categoria = 'DULCES' THEN 'cake'
         WHEN categoria = 'HELADERIA' THEN 'icecream'
         WHEN categoria = 'SANDUCHES' THEN 'lunch_dining'
         WHEN categoria = 'PAPAS' THEN 'fastfood'
         WHEN categoria = 'LACTEOS' THEN 'local_drink'
         WHEN categoria = 'GASEOSAS' THEN 'local_drink'
         WHEN categoria = 'PAQUETES' THEN 'shopping_bag'
         WHEN categoria = 'PASTELERIA' THEN 'cake'
         WHEN categoria = 'REFRESCOS' THEN 'local_drink'
         WHEN categoria = 'VARIOS' THEN 'category'
         WHEN categoria = 'MEDICAMENTOS' THEN 'medication'
         ELSE 'restaurant_menu'
       END as icon,
       CASE 
         WHEN categoria = 'ALMUERZOS' THEN '#8D6E63'
         WHEN categoria = 'BEBIDAS' THEN '#6D4C41'
         WHEN categoria = 'BEBIDAS PROPIAS' THEN '#5D4037'
         WHEN categoria = 'COMIDA RÁPIDA' THEN '#8D6E63'
         WHEN categoria = 'DESAYUNOS' THEN '#6D4C41'
         WHEN categoria = 'DULCES' THEN '#5D4037'
         WHEN categoria = 'HELADERIA' THEN '#8D6E63'
         WHEN categoria = 'SANDUCHES' THEN '#6D4C41'
         WHEN categoria = 'PAPAS' THEN '#5D4037'
         WHEN categoria = 'LACTEOS' THEN '#8D6E63'
         WHEN categoria = 'GASEOSAS' THEN '#6D4C41'
         WHEN categoria = 'PAQUETES' THEN '#5D4037'
         WHEN categoria = 'PASTELERIA' THEN '#8D6E63'
         WHEN categoria = 'REFRESCOS' THEN '#6D4C41'
         WHEN categoria = 'VARIOS' THEN '#5D4037'
         WHEN categoria = 'MEDICAMENTOS' THEN '#D32F2F'
         ELSE '#8D6E63'
       END as color
       FROM Productos 
       WHERE disponibilidad = 'TRUE'
       ORDER BY categoria`
    );
    
    await connection.end();
    console.log(`✅ Enviadas ${rows.length} categorías`);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    if (connection) await connection.end();
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

// Ruta para obtener productos por categoría
app.get('/api/categories/:categoryName/products', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const categoryName = req.params.categoryName;
    
    console.log(`🔄 Solicitando productos para categoría: ${categoryName}`);
    
    const [rows] = await connection.execute(
      `SELECT 
        id_producto as id,
        nombre as name,
        precio,
        descripcion,
        categoria as category,
        CASE 
          WHEN categoria = 'ALMUERZOS' THEN 'restaurant'
          WHEN categoria = 'BEBIDAS' THEN 'local_drink'
          WHEN categoria = 'BEBIDAS PROPIAS' THEN 'coffee'
          WHEN categoria = 'COMIDA RÁPIDA' THEN 'fastfood'
          WHEN categoria = 'DESAYUNOS' THEN 'breakfast_dining'
          WHEN categoria = 'DULCES' THEN 'cake'
          WHEN categoria = 'HELADERIA' THEN 'icecream'
          WHEN categoria = 'SANDUCHES' THEN 'lunch_dining'
          WHEN categoria = 'PAPAS' THEN 'fastfood'
          WHEN categoria = 'LACTEOS' THEN 'local_drink'
          WHEN categoria = 'GASEOSAS' THEN 'local_drink'
          WHEN categoria = 'PAQUETES' THEN 'shopping_bag'
          WHEN categoria = 'PASTELERIA' THEN 'cake'
          WHEN categoria = 'REFRESCOS' THEN 'local_drink'
          WHEN categoria = 'VARIOS' THEN 'category'
          WHEN categoria = 'MEDICAMENTOS' THEN 'medication'
          ELSE 'restaurant_menu'
        END as icon
       FROM Productos 
       WHERE categoria = ? AND disponibilidad = 'TRUE'
       ORDER BY nombre`,
      [categoryName]
    );
    
    await connection.end();
    
    // Convertir precio de string a número
    const products = rows.map(product => {
      let price = 0;
      if (product.precio) {
        const priceString = product.precio.replace(/[^\d.]/g, '');
        price = parseFloat(priceString) || 0;
      }
      
      return {
        ...product,
        price: price
      };
    });
    
    console.log(`✅ Enviados ${products.length} productos para categoría: ${categoryName}`);
    res.json(products);
  } catch (error) {
    console.error(`❌ Error fetching products for ${req.params.categoryName}:`, error.message);
    if (connection) await connection.end();
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

// Ruta para obtener todos los productos
app.get('/api/products', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    
    console.log('🔄 Solicitando todos los productos');
    
    const [rows] = await connection.execute(
      `SELECT 
        id_producto as id,
        nombre as name,
        precio,
        descripcion,
        categoria as category,
        CASE 
          WHEN categoria = 'ALMUERZOS' THEN 'restaurant'
          WHEN categoria = 'BEBIDAS' THEN 'local_drink'
          WHEN categoria = 'BEBIDAS PROPIAS' THEN 'coffee'
          WHEN categoria = 'COMIDA RÁPIDA' THEN 'fastfood'
          WHEN categoria = 'DESAYUNOS' THEN 'breakfast_dining'
          WHEN categoria = 'DULCES' THEN 'cake'
          WHEN categoria = 'HELADERIA' THEN 'icecream'
          WHEN categoria = 'SANDUCHES' THEN 'lunch_dining'
          WHEN categoria = 'PAPAS' THEN 'fastfood'
          WHEN categoria = 'LACTEOS' THEN 'local_drink'
          WHEN categoria = 'GASEOSAS' THEN 'local_drink'
          WHEN categoria = 'PAQUETES' THEN 'shopping_bag'
          WHEN categoria = 'PASTELERIA' THEN 'cake'
          WHEN categoria = 'REFRESCOS' THEN 'local_drink'
          WHEN categoria = 'VARIOS' THEN 'category'
          WHEN categoria = 'MEDICAMENTOS' THEN 'medication'
          ELSE 'restaurant_menu'
        END as icon
       FROM Productos 
       WHERE disponibilidad = 'TRUE'
       ORDER BY categoria, nombre`
    );
    
    await connection.end();
    
    // Convertir precio de string a número
    const products = rows.map(product => {
      let price = 0;
      if (product.precio) {
        const priceString = product.precio.replace(/[^\d.]/g, '');
        price = parseFloat(priceString) || 0;
      }
      
      return {
        ...product,
        price: price
      };
    });
    
    console.log(`✅ Enviados ${products.length} productos en total`);
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching all products:', error.message);
    if (connection) await connection.end();
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

// Ruta para buscar productos
app.get('/api/products/search', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const searchTerm = `%${req.query.q}%`;
    
    console.log(`🔍 Búsqueda de productos: ${req.query.q}`);
    
    const [rows] = await connection.execute(
      `SELECT 
        id_producto as id,
        nombre as name,
        precio,
        descripcion,
        categoria as category
       FROM Productos 
       WHERE nombre LIKE ? AND disponibilidad = 'TRUE'
       ORDER BY nombre`,
      [searchTerm]
    );
    
    await connection.end();
    
    const products = rows.map(product => {
      let price = 0;
      if (product.precio) {
        const priceString = product.precio.replace(/[^\d.]/g, '');
        price = parseFloat(priceString) || 0;
      }
      
      return {
        ...product,
        price: price
      };
    });
    
    console.log(`✅ Encontrados ${products.length} productos para búsqueda: ${req.query.q}`);
    res.json(products);
  } catch (error) {
    console.error('❌ Error searching products:', error.message);
    if (connection) await connection.end();
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Flutter ejecutándose en http://0.0.0.0:${PORT}`);
  console.log(`📊 Conectado a: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`🗄️  Base de datos: ${dbConfig.database}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
