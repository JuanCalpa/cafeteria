const connect = require('../../database/sqlConnection');


async function crearPedido(id_usuario, productos, estado = 'pendiente') {
    const conn = await connect();
    try {
        const [pedidoResult] = await conn.query(
            'INSERT INTO pedidos (id_usuario, estado, fecha_pedido) VALUES (?, ?, NOW())',
            [id_usuario, estado]
        );
        const id_pedido = pedidoResult.insertId;

        for (const prod of productos) {
            await conn.query(
                'INSERT INTO detallepedido (id_pedido, id_producto, cantidad, especificaciones) VALUES (?, ?, ?, ?)',
                [id_pedido, prod.id_producto, prod.cantidad, prod.especificaciones || '']
            );
        }
        return { success: true, id_pedido };
    } finally {
        conn.release();
    }
}

async function consultarPedidos(id_usuario) {
    const conn = await connect();
    try {
        const [pedidos] = await conn.query(
            `SELECT p.*, d.id_producto, d.cantidad, d.especificaciones
             FROM pedidos p
             LEFT JOIN detallepedido d ON p.id_pedido = d.id_pedido
             WHERE p.id_usuario = ?`,
            [id_usuario]
        );
        return pedidos;
    } finally {
        conn.release();
    }
}


async function actualizarPedido(id_usuario, id_pedido, productos) {
    const conn = await connect();
    try {
        const [[pedido]] = await conn.query(
            'SELECT estado FROM pedidos WHERE id_pedido = ? AND id_usuario = ?',
            [id_pedido, id_usuario]
        );
        if (!pedido || pedido.estado !== 'pendiente') return { success: false, message: 'No se puede actualizar' };

        await conn.query('DELETE FROM detallepedido WHERE id_pedido = ?', [id_pedido]);

        for (const prod of productos) {
            await conn.query(
                'INSERT INTO detallepedido (id_pedido, id_producto, cantidad, especificaciones) VALUES (?, ?, ?, ?)',
                [id_pedido, prod.id_producto, prod.cantidad, prod.especificaciones || '']
            );
        }
        return { success: true };
    } finally {
        conn.release();
    }
}


async function cancelarPedido(id_usuario, id_pedido) {
    const conn = await connect();
    try {
       
        const [[pedido]] = await conn.query(
            'SELECT estado FROM pedidos WHERE id_pedido = ? AND id_usuario = ?',
            [id_pedido, id_usuario]
        );
        if (!pedido || pedido.estado !== 'pendiente') return { success: false, message: 'No se puede cancelar' };

        
        await conn.query(
            'UPDATE pedidos SET estado = ? WHERE id_pedido = ?',
            ['cancelado', id_pedido]
        );
        return { success: true };
    } finally {
        conn.release();
    }
}

module.exports = {
    crearPedido,
    consultarPedidos,
    actualizarPedido,
    cancelarPedido
};