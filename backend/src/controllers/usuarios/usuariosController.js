const pedidosSql = require('./usuariosSql');

async function crearPedido(req, res) {
    const usuario = req.session.usuario;
    const { productos } = req.body;
    console.log('Crear pedido:', { usuario, productos });

    if (!usuario) {
        return res.status(401).json({ mensaje: 'No autenticado' });
    }

    try {
        const result = await pedidosSql.crearPedido(usuario.id, productos);
        console.log('Pedido creado:', result);
        res.status(201).json({ mensaje: 'Pedido creado exitosamente', result });
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
}

async function consultarPedidos(req, res) {
    const usuario = req.session.usuario;
    console.log('Consultar pedidos:', usuario);

    if (!usuario) {
        return res.status(401).json({ mensaje: 'No autenticado' });
    }

    try {
        const pedidos = await pedidosSql.consultarPedidos(usuario.id);
        res.status(200).json({ pedidos });
    } catch (error) {
        console.error('Error al consultar pedidos:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
}

async function actualizarPedido(req, res) {
    const usuario = req.session.usuario;
    const { id_pedido, productos } = req.body;
    console.log('Actualizar pedido:', { usuario, id_pedido, productos });

    if (!usuario) {
        return res.status(401).json({ mensaje: 'No autenticado' });
    }

    try {
        const result = await pedidosSql.actualizarPedido(usuario.id, id_pedido, productos);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
}

async function cancelarPedido(req, res) {
    const usuario = req.session.usuario;
    const { id_pedido } = req.body;
    console.log('Cancelar pedido:', { usuario, id_pedido });

    if (!usuario) {
        return res.status(401).json({ mensaje: 'No autenticado' });
    }

    try {
        const result = await pedidosSql.cancelarPedido(usuario.id, id_pedido);
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