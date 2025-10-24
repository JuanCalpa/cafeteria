const connect = require('../../database/sqlConnection');

// ========================
// OBTENER TODOS LOS PEDIDOS
// ========================
async function getPedidosPanel(req, res) {
  try {
    const connection = await connect();

    // Primero obtenemos los pedidos con datos básicos y total correcto
    const [pedidos] = await connection.execute(`
      SELECT 
        p.id_pedido,
        u.nombre AS usuario,
        u.correo,
        p.estado,
        p.fecha_pedido,
        IFNULL(SUM(CAST(REPLACE(REPLACE(pr.precio, '$', ''), ',', '') AS DECIMAL(10,2)) * CAST(d.cantidad AS DECIMAL(10,2))), 0) AS total
      FROM Pedidos p
      JOIN Usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN Producto_Pedido d ON p.id_pedido = d.id_pedido
      LEFT JOIN Productos pr ON d.id_producto = pr.id_producto
      GROUP BY p.id_pedido
      ORDER BY p.id_pedido DESC
    `);

    // Ahora añadimos los productos a cada pedido individualmente
    for (const pedido of pedidos) {
      const [productos] = await connection.execute(`
        SELECT 
          pr.nombre,
          d.cantidad,
          REPLACE(REPLACE(pr.precio, '$', ''), ',', '') AS precio_num,
          (CAST(REPLACE(REPLACE(pr.precio, '$', ''), ',', '') AS DECIMAL(10,2)) * CAST(d.cantidad AS DECIMAL(10,2))) AS subtotal,
          d.especificaciones
        FROM Producto_Pedido d
        JOIN Productos pr ON d.id_producto = pr.id_producto
        WHERE d.id_pedido = ?
      `, [pedido.id_pedido]);

      pedido.productos = productos;
    }

    await connection.end();
    res.json(pedidos);

  } catch (err) {
    console.error("Error en getPedidosPanel:", err);
    res.status(500).json({ error: 'Error al obtener pedidos panel' });
  }
}

// ========================
// OBTENER UN PEDIDO POR ID
// ========================
async function getPedidoPorId(req, res) {
  const { id } = req.params;

  try {
    const connection = await connect();

    const [pedidoRows] = await connection.execute(`
      SELECT
        p.id_pedido,
        u.nombre AS usuario,
        u.correo,
        p.estado,
        p.fecha_pedido
      FROM Pedidos p
      JOIN Usuarios u ON p.id_usuario = u.id_usuario
      WHERE p.id_pedido = ?
    `, [id]);

    if (pedidoRows.length === 0) {
      await connection.end();
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    const pedido = pedidoRows[0];

    // Obtener productos del pedido
    const [productosRows] = await connection.execute(`
      SELECT 
        pr.nombre,
        d.cantidad,
        REPLACE(REPLACE(pr.precio, '$', ''), ',', '') AS precio_num,
        (CAST(REPLACE(REPLACE(pr.precio, '$', ''), ',', '') AS DECIMAL(10,2)) * CAST(d.cantidad AS DECIMAL(10,2))) AS subtotal,
        d.especificaciones
      FROM Producto_Pedido d
      JOIN Productos pr ON d.id_producto = pr.id_producto
      WHERE d.id_pedido = ?
    `, [id]);

    pedido.productos = productosRows;
    pedido.total = productosRows.reduce((acc, p) => acc + Number(p.subtotal || 0), 0);

    await connection.end();
    res.json(pedido);

  } catch (err) {
    console.error("Error en getPedidoPorId:", err);
    res.status(500).json({ error: 'Error al obtener pedido por ID' });
  }
}

module.exports = { getPedidosPanel, getPedidoPorId };
