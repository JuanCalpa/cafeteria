const connect = require('../../database/sqlConnection');

async function crearPedido(id_usuario, productos, estado = 'pendiente') {
    const connection = await connect();
    const [pedidoResult] = await connection.execute(
        'INSERT INTO Pedidos (id_usuario, estado, fecha_pedido) VALUES (?, ?, NOW())',
        [id_usuario, estado]
    );
    const id_pedido = pedidoResult.insertId;

    for (const prod of productos) {
        await connection.execute(
            'INSERT INTO Producto_Pedido (id_pedido, id_producto, cantidad, especificaciones) VALUES (?, ?, ?, ?)',
            [id_pedido, prod.id_producto, prod.cantidad, prod.especificaciones || '']
        );
    }
    await connection.end();
    return { success: true, id_pedido };
}

async function consultarPedidos(id_usuario) {
    const connection = await connect();
    const [rows] = await connection.execute(
        `SELECT p.*, d.id_producto, d.cantidad, d.especificaciones, prod.nombre as nombre_producto
         FROM Pedidos p
         LEFT JOIN
         Producto_Pedido d ON p.id_pedido = d.id_pedido
         LEFT JOIN
         Productos prod ON d.id_producto = prod.id_producto
         WHERE p.id_usuario = ?`,
        [id_usuario]
    );
    await connection.end();

    // Agrupar por id_pedido
    const pedidosMap = {};
    rows.forEach(row => {
        const id_pedido = row.id_pedido;
        if (!pedidosMap[id_pedido]) {
            pedidosMap[id_pedido] = {
                id_pedido: row.id_pedido,
                id_usuario: row.id_usuario,
                estado: row.estado,
                fecha_pedido: row.fecha_pedido,
                productos: []
            };
        }
        if (row.id_producto) {
            pedidosMap[id_pedido].productos.push({
                id_producto: row.id_producto,
                nombre: row.nombre_producto,
                cantidad: row.cantidad,
                especificaciones: row.especificaciones
            });
        }
    });

    const pedidos = Object.values(pedidosMap);
    return pedidos;
}

async function actualizarPedidoEstado(id_pedido, estado) {
    const connection = await connect();
    await connection.execute('UPDATE Pedidos SET estado = ? WHERE id_pedido = ?', [estado, id_pedido]);
    await connection.end();
    return { success: true, message: 'Pedido actualizado correctamente' };
}

async function actualizarPedido(id_usuario, id_pedido, productos) {
    const connection = await connect();
    const [[pedido]] = await connection.execute(
        'SELECT estado FROM Pedidos WHERE id_pedido = ? AND id_usuario = ?',
        [id_pedido, id_usuario]
    );
    if (!pedido || pedido.estado !== 'pendiente') {
        await connection.end();
        return { success: false, message: 'No se puede actualizar' };
    }

    await connection.execute('DELETE FROM Producto_Pedido WHERE id_pedido = ?', [id_pedido]);

    for (const prod of productos) {
        await connection.execute(
            'INSERT INTO Producto_Pedido (id_pedido, id_producto, cantidad, especificaciones) VALUES (?, ?, ?, ?)',
            [id_pedido, prod.id_producto, prod.cantidad, prod.especificaciones || '']
        );
    }
    await connection.end();
    return { success: true };
}

async function eliminarPedidoAdmin(id_pedido) {
    const connection = await connect();
    // Elimina las notificaciones asociadas al pedido
    await connection.execute('DELETE FROM Notificaciones WHERE id_pedido = ?', [id_pedido]);
    // Elimina los pagos asociados al pedido
    await connection.execute('DELETE FROM Pagos WHERE id_pedido = ?', [id_pedido]);
    // Elimina las confirmaciones de pago asociadas al pedido
    await connection.execute('DELETE FROM Confirmaciones_Pago WHERE id_pedido = ?', [id_pedido]);
    // Elimina los productos asociados al pedido
    await connection.execute('DELETE FROM Producto_Pedido WHERE id_pedido = ?', [id_pedido]);
    // Elimina el pedido
    await connection.execute('DELETE FROM Pedidos WHERE id_pedido = ?', [id_pedido]);

    await connection.end();
    return { success: true, message: 'Pedido eliminado correctamente' };
}

async function eliminarPedido(id_usuario, id_pedido) {
    const connection = await connect();
    const [[pedido]] = await connection.execute(
        'SELECT estado FROM Pedidos WHERE id_pedido = ? AND id_usuario = ?',
        [id_pedido, id_usuario]
    );
    if (!pedido || pedido.estado !== 'pendiente') {
        await connection.end();
        return { success: false, message: 'No se puede eliminar' };
    }

    // Elimina los productos asociados al pedido
    await connection.execute('DELETE FROM Producto_Pedido WHERE id_pedido = ?', [id_pedido]);
    // Elimina el pedido
    await connection.execute('DELETE FROM Pedidos WHERE id_pedido = ?', [id_pedido]);

    await connection.end();
    return { success: true };
}
module.exports = {
    crearPedido,
    consultarPedidos,
    actualizarPedido,
    actualizarPedidoEstado,
    eliminarPedido,
    eliminarPedidoAdmin
};
