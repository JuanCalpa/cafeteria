const router = require('express').Router();
const pedidosController = require('../controllers/pedidos/pedidosController');
const verificarRol = require('./intermedios/verificarRol');

// obtener todos los pedidos
router.get('/pedidosPanel', verificarRol(['administrador']), pedidosController.getAllPedidos);

// Obtener pedido por ID
router.get('/pedidosPanel/:id_pedido', verificarRol(['administrador']), pedidosController.getPedidoById);

// Actualizar pedido
router.put('/actualizarPedido', verificarRol(['administrador']), pedidosController.actualizarPedido);

// Eliminar pedido
router.post('/cancelarPedido', verificarRol(['administrador']), pedidosController.cancelarPedido);

// Crear pedido manual
router.post('/crearPedidoManual', verificarRol(['administrador']), pedidosController.crearPedidoManual);

module.exports = router;
