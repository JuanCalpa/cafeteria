const router = require('express').Router();
const pedidosController = require('../controllers/pedidos/pedidosController');
const verificarRol = require('./intermedios/verificarRol');

// obtener todos los pedidos
router.get('/pedidosPanel', verificarRol(['administrador']), pedidosController.getAllPedidos);

// obtener pedidos para cocina (solo información de Producto_Pedido)
router.get('/pedidosCocina', verificarRol(['cocina']), pedidosController.getPedidosCocina);

// Obtener pedido por ID
router.get('/pedidosPanel/:id_pedido', verificarRol(['administrador']), pedidosController.getPedidoById);

// Actualizar pedido
router.put('/actualizarPedido', verificarRol(['administrador']), pedidosController.actualizarPedido);

// Eliminar pedido
router.post('/cancelarPedido', verificarRol(['administrador']), pedidosController.cancelarPedido);

// Crear pedido manual
router.post('/crearPedidoManual', verificarRol(['administrador']), pedidosController.crearPedidoManual);

// Crear pedido desde la app móvil
router.post('/crearPedidoDesdeApp', pedidosController.crearPedidoDesdeApp);

// Consultar pedidos del usuario autenticado
router.post('/consultarPedidos', pedidosController.consultarPedidosUsuario);

module.exports = router;
