const pedidosSql = require('./usuariosSql');

async function crearPedido(req, res) {
    const { id_usuario, productos } = req.body;
    console.log('Crear pedido:', { id_usuario, productos });

    try {
        const result = await pedidosSql.crearPedido(id_usuario, productos);
        console.log('Pedido creado:', result);
        res.status(201).json({ mensaje: 'Pedido creado exitosamente', result });
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
}

async function consultarPedidos(req, res) {
    const { id_usuario } = req.body;
    console.log('Consultar pedidos:', id_usuario);

    try {
        const pedidos = await pedidosSql.consultarPedidos(id_usuario);
        res.status(200).json({ pedidos });
    } catch (error) {
        console.error('Error al consultar pedidos:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
}

async function actualizarPedido(req, res) {
    const { id_usuario, id_pedido, productos } = req.body;
    console.log('Actualizar pedido:', { id_usuario, id_pedido, productos });

    try {
        const result = await pedidosSql.actualizarPedido(id_usuario, id_pedido, productos);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
}

async function cancelarPedido(req, res) {
    const { id_usuario, id_pedido } = req.body;
    console.log('Cancelar pedido:', { id_usuario, id_pedido });

    try {
        const result = await pedidosSql.eliminarPedido(id_usuario, id_pedido);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al cancelar pedido:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
}

module.exports = {
    crearPedido,
    consultarPedidos,
    actualizarPedido,
    cancelarPedido
};