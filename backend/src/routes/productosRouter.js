const router = require('./baseRouter');
const productosController = require('../controllers/productos/productosController');
const verificarRol = require('./intermedios/verificarRol');

//  Todos pueden ver productos
router.get('/products', productosController.getProductos);
router.get('/productoById', productosController.getProductoById);

// Solo los administradores pueden crear, actualizar o eliminar
router.post('/createProducto', verificarRol(['admin', 'administrador']), productosController.createProducto);
router.put('/updateProducto/:id_producto', verificarRol(['admin', 'administrador']), productosController.updateProducto);
router.delete('/deleteProducto/:id_producto', verificarRol(['admin', 'administrador']), productosController.deleteProducto);

// Obtener categorías
router.get('/categories', productosController.getCategorias);

// Endpoint para productos por categoría
router.get('/categories/:categoryName/products', productosController.getProductosByCategory);

// Endpoint para buscar productos
router.get('/products/search', productosController.searchProductos);

module.exports = router;
