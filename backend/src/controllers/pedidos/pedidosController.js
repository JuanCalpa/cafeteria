const connect = require('../../database/sqlConnection');

//  Obtener todos los pedidos (con total incluido)
async function getAllPedidos(req, res) {
  try {
    const connection = await connect();
    const [rows] = await connection.execute(`
      SELECT
        p.id_pedido,
        u.nombre AS usuario,
        u.correo,
        p.estado,
        p.fecha_pedido,
        IFNULL(SUM(pr.precio * pp.cantidad), 0) AS total
      FROM Pedidos p
      JOIN Usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN Producto_Pedido pp ON p.id_pedido = pp.id_pedido
      LEFT JOIN Productos pr ON pp.id_producto = pr.id_producto
      GROUP BY p.id_pedido, u.nombre, u.correo, p.estado, p.fecha_pedido
      ORDER BY p.id_pedido DESC
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
}


// Obtener un pedido por ID (con productos incluidos)
async function getPedidoById(req, res) {
  const { id_pedido } = req.params;

  try {
    const connection = await connect();

    // Primero obtenemos la información general del pedido
    const [pedidoInfo] = await connection.execute(`
      SELECT
        p.id_pedido,
        u.nombre AS usuario,
        u.correo,
        p.fecha_pedido,
        p.estado,
        IFNULL(SUM(CAST(REPLACE(REPLACE(pr.precio, '$', ''), ',', '') AS DECIMAL(10,2)) * CAST(pp.cantidad AS DECIMAL(10,2))), 0) AS total
      FROM Pedidos p
      JOIN Usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN Producto_Pedido pp ON p.id_pedido = pp.id_pedido
      LEFT JOIN Productos pr ON pp.id_producto = pr.id_producto
      WHERE p.id_pedido = ?
      GROUP BY p.id_pedido, u.nombre, u.correo, p.fecha_pedido, p.estado
    `, [id_pedido]);

    if (!pedidoInfo.length) {
      await connection.end();
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Luego obtenemos el detalle de productos del pedido
    const [productos] = await connection.execute(`
      SELECT
        pr.nombre,
        pr.precio,
        pp.cantidad,
        CAST(REPLACE(REPLACE(pr.precio, '$', ''), ',', '') AS DECIMAL(10,2)) * CAST(pp.cantidad AS DECIMAL(10,2)) AS subtotal
      FROM Producto_Pedido pp
      JOIN Productos pr ON pp.id_producto = pr.id_producto
      WHERE pp.id_pedido = ?
    `, [id_pedido]);

    await connection.end();

    // Combinamos todo en un único objeto
    const pedido = {
      ...pedidoInfo[0],
      productos
    };

    res.json(pedido);
  } catch (error) {
    console.error("Error en getPedidoById:", error);
    res.status(500).json({ message: "Error al obtener el pedido" });
  }
}


// Actualizar pedido
async function actualizarPedido(req, res) {
  const { id_pedido, estado } = req.body;
  if (!id_pedido || !estado)
    return res.status(400).json({ error: 'Datos incompletos' });

  try {
    const connection = await connect();
    await connection.execute('UPDATE Pedidos SET estado = ? WHERE id_pedido = ?', [estado, id_pedido]);
    await connection.end();
    res.json({ success: true, message: 'Pedido actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar pedido:', err);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
}

// Cancelar o eliminar pedido
async function cancelarPedido(req, res) {
  const { id_pedido } = req.body;
  if (!id_pedido)
    return res.status(400).json({ error: 'Falta el ID del pedido' });

  try {
    const connection = await connect();
    // Elimina las notificaciones asociadas al pedido
    await connection.execute('DELETE FROM Notificaciones WHERE id_pedido = ?', [id_pedido]);
    // Elimina los pagos asociados al pedido
    await connection.execute('DELETE FROM Pagos WHERE id_pedido = ?', [id_pedido]);
    // Elimina los productos asociados al pedido
    await connection.execute('DELETE FROM Producto_Pedido WHERE id_pedido = ?', [id_pedido]);
    // Elimina el pedido
    await connection.execute('DELETE FROM Pedidos WHERE id_pedido = ?', [id_pedido]);
    await connection.end();
    res.json({ success: true, message: 'Pedido eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar pedido:', err);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
}

// Crear pedido manual (para pedidos presenciales)
async function crearPedidoManual(req, res) {
  const { id_usuario, productos } = req.body;

  if (!id_usuario || !productos || productos.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos para crear pedido' });
  }

  try {
    const connection = await connect();

    // Crear el pedido base
    const [pedido] = await connection.execute(
      'INSERT INTO Pedidos (id_usuario, estado, fecha_pedido) VALUES (?, ?, NOW())',
      [id_usuario, 'pendiente']
    );

    const id_pedido = pedido.insertId;

    // Insertar los productos del pedido
    for (const p of productos) {
      await connection.execute(
        'INSERT INTO Producto_Pedido (id_pedido, id_producto, cantidad) VALUES (?, ?, ?)',
        [id_pedido, p.id_producto, p.cantidad]
      );
    }

    await connection.end();
    res.json({ success: true, message: 'Pedido manual creado correctamente', id_pedido });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
}

// Obtener pedidos para cocina (todos los pedidos con productos y especificaciones)
async function getPedidosCocina(req, res) {
  try {
    const connection = await connect();
    const [rows] = await connection.execute(`
      SELECT
        p.id_pedido,
        u.nombre AS usuario,
        GROUP_CONCAT(
          CONCAT(
            pr.nombre,
            ' x',
            pp.cantidad,
            CASE WHEN pp.especificaciones IS NOT NULL AND pp.especificaciones != '' THEN CONCAT(' (', pp.especificaciones, ')') ELSE '' END
          )
          SEPARATOR ', '
        ) AS productos_especificaciones
      FROM Producto_Pedido pp
      JOIN Pedidos p ON pp.id_pedido = p.id_pedido
      JOIN Productos pr ON pp.id_producto = pr.id_producto
      JOIN Usuarios u ON p.id_usuario = u.id_usuario
      GROUP BY p.id_pedido, u.nombre
      ORDER BY p.id_pedido DESC
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pedidos para cocina:', error);
    res.status(500).json({ error: 'Error al obtener pedidos para cocina' });
  }
}

// Crear pedido desde la app móvil
async function crearPedidoDesdeApp(req, res) {
  const { id_usuario, productos } = req.body;

  if (!id_usuario || !productos || productos.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos para crear pedido' });
  }

  try {
    const connection = await connect();

    // Crear el pedido base con estado 'pendiente'
    const [pedido] = await connection.execute(
      'INSERT INTO Pedidos (id_usuario, estado, fecha_pedido) VALUES (?, ?, NOW())',
      [id_usuario, 'pendiente']
    );

    const id_pedido = pedido.insertId;

    // Insertar los productos del pedido
    for (const p of productos) {
      await connection.execute(
        'INSERT INTO Producto_Pedido (id_pedido, id_producto, cantidad) VALUES (?, ?, ?)',
        [id_pedido, p.id_producto, p.cantidad]
      );
    }

    await connection.end();
    res.json({ success: true, message: 'Pedido creado correctamente', id_pedido });
  } catch (err) {
    console.error('Error al crear pedido desde app:', err);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
}

module.exports = {
  getAllPedidos,
  getPedidoById,
  actualizarPedido,
  cancelarPedido,
  crearPedidoManual,
  getPedidosCocina,
  crearPedidoDesdeApp
};
