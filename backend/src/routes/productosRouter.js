const router = require('./baseRouter');
const productosController = require('../controllers/productos/productosController');

router.get('/productos', productosController.getProductos);
router.get('/productoById', productosController.getProductoById);
router.post('/createProducto', productosController.createProducto);
router.put('/updateProducto/:id_producto', productosController.updateProducto);
router.delete('/deleteProducto/:id_producto', productosController.deleteProducto);

module.exports = router;