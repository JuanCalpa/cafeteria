const router = require('./baseRouter');
const productosController = require('../controllers/productos/productosController');

router.get('/productos', productosController.getProductos);

module.exports = router;