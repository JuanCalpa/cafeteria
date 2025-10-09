const router = require('./baseRouter');
const pedidosController = require('../controllers/pedidos/pedidosController');
const verificarRol = require('./intermedios/verificarRol');


// 🟦 Todos pueden ver productos
router.get('/productos', productosController.getProductos);
router.get('/productoById', productosController.getProductoById);

// 🟩 Solo los administradores pueden crear, actualizar o eliminar
router.post('/createProducto', verificarRol(['admin']), productosController.createProducto);
router.put('/updateProducto/:id_producto', verificarRol(['admin']), productosController.updateProducto);
router.delete('/deleteProducto/:id_producto', verificarRol(['admin']), productosController.deleteProducto);

// Nueva ruta para obtener todos los pedidos
router.get('/all', pedidosController.getAllPedidos);

module.exports = router;