const router = require('./baseRouter');
const productosController = require('../controllers/usuarios/usuariosController');

router.post('/crearPedido', productosController.crearPedido);
router.get('/consultarPedidos', productosController.consultarPedidos);
router.put('/actualizarPedido', productosController.actualizarPedido);
router.post('/cancelarPedido', productosController.cancelarPedido);

module.exports = router;