const router = require('./baseRouter');
const usuariosController = require('../controllers/usuarios/usuariosController');
const verificarRol = require('./intermedios/verificarRol');
const pedidosPanelController = require('../controllers/usuarios/pedidosPanelController');



// 🟩 Solo usuarios logueados (rol cliente o admin) pueden crear pedidos
router.post('/crearPedido', verificarRol(['cliente', 'admin']), usuariosController.crearPedido);
// Cocina también puede ver y actualizar pedidos, pero no crear ni cancelar
router.post('/crearPedido', verificarRol(['cliente', 'admin']), usuariosController.crearPedido);
router.get('/consultarPedidos', verificarRol(['admin', 'cocina']), usuariosController.consultarPedidos);
router.put('/actualizarPedido', verificarRol(['cliente', 'admin', 'cocina']), usuariosController.actualizarPedido);
router.post('/cancelarPedido', verificarRol(['cliente', 'admin']), usuariosController.cancelarPedido);


// 🟩 Solo admin puede consultar todos los pedidos
router.get('/consultarPedidos', verificarRol(['admin']), usuariosController.consultarPedidos);

// 🟦 Clientes o admin pueden actualizar o cancelar su pedido
router.put('/actualizarPedido', verificarRol(['cliente', 'admin']), usuariosController.actualizarPedido);
router.post('/cancelarPedido', verificarRol(['cliente', 'admin']), usuariosController.cancelarPedido);

// Endpoint para el panel de administración (solo admin o administrador)
router.get('/pedidosPanel', verificarRol(['admin', 'administrador']), pedidosPanelController.getPedidosPanel);

module.exports = router;
