const router = require('./baseRouter');
const productosController = require('../controllers/productos/productosController');
const verificarRol = require('./intermedios/verificarRol');


;

// 🟦 Todos pueden ver productos
router.get('/productos', productosController.getProductos);
router.get('/productoById', productosController.getProductoById);

// 🟩 Solo los administradores pueden crear, actualizar o eliminar
router.post('/createProducto', verificarRol(['admin']), productosController.createProducto);
router.put('/updateProducto/:id_producto', verificarRol(['admin']), productosController.updateProducto);
router.delete('/deleteProducto/:id_producto', verificarRol(['admin']), productosController.deleteProducto);

module.exports = router;
