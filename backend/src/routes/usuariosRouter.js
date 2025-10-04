const router = require('./baseRouter');
const usuariosController = require('../controllers/usuarios/usuariosController');
const verificarRol = require('./intermedios/verificarRol');




// 🟩 Solo usuarios logueados (rol cliente o admin) pueden crear pedidos
router.post('/crearPedido', verificarRol(['cliente', 'admin']), usuariosController.crearPedido);

// 🟩 Solo admin puede consultar todos los pedidos
router.get('/consultarPedidos', verificarRol(['admin']), usuariosController.consultarPedidos);

// 🟦 Clientes o admin pueden actualizar o cancelar su pedido
router.put('/actualizarPedido', verificarRol(['cliente', 'admin']), usuariosController.actualizarPedido);
router.post('/cancelarPedido', verificarRol(['cliente', 'admin']), usuariosController.cancelarPedido);

module.exports = router;
