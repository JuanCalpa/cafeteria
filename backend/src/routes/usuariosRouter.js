const router = require('./baseRouter');
const usuariosController = require('../controllers/usuarios/usuariosController');
const verificarRol = require('./intermedios/verificarRol');
const pedidosPanelController = require('../controllers/usuarios/pedidosPanelController');



// Solo usuarios logueados (rol cliente o admin) pueden crear pedidos
router.post('/crearPedido', verificarRol(['cliente', 'admin', 'administrador']), usuariosController.crearPedido);
// Cocina también puede ver y actualizar pedidos, pero no crear ni cancelar
router.post('/crearPedido', verificarRol(['cliente', 'admin', 'administrador']), usuariosController.crearPedido);
router.get('/consultarPedidos', verificarRol(['admin', 'cocina', 'administrador']), usuariosController.consultarPedidos);
router.put('/actualizarPedido', verificarRol(['cliente', 'admin', 'cocina', 'administrador']), usuariosController.actualizarPedido);
router.post('/cancelarPedido', verificarRol(['cliente', 'admin', 'administrador']), usuariosController.cancelarPedido);


// Solo admin puede consultar todos los pedidos
router.get('/consultarPedidos', verificarRol(['admin', 'administrador']), usuariosController.consultarPedidos);

// Clientes o admin pueden actualizar o cancelar su pedido
router.put('/actualizarPedido', verificarRol(['cliente', 'admin', 'administrador']), usuariosController.actualizarPedido);
router.post('/cancelarPedido', verificarRol(['cliente', 'admin', 'administrador']), usuariosController.cancelarPedido);

// Endpoint para el panel de administración (solo admin o administrador)
router.get('/pedidosPanel', verificarRol(['admin', 'administrador']), pedidosPanelController.getPedidosPanel);

module.exports = router;
