const connect = require('../../database/sqlConnection');

async function getPedidosPanel(req, res) {
  try {
    const connection = await connect();
    const [rows] = await connection.execute(`
      SELECT 
        p.id_pedido,
        u.nombre AS usuario,
        u.correo,
        p.estado,
        p.fecha_pedido,
        GROUP_CONCAT(CONCAT(pr.nombre, ' x', d.cantidad, IF(d.especificaciones<>'', CONCAT(' (', d.especificaciones, ')'), '')) SEPARATOR ', ') AS productos
      FROM Pedidos p
      JOIN Usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN Producto_Pedido d ON p.id_pedido = d.id_pedido
      LEFT JOIN Productos pr ON d.id_producto = pr.id_producto
      GROUP BY p.id_pedido
      ORDER BY p.id_pedido DESC
    `);
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos panel' });
  }
}

module.exports = { getPedidosPanel };
