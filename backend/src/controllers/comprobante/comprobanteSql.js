const connect = require('../../database/sqlConnection');

async function createComprobante(id_pedido, id_usuario, buffer, mime, originalName) {
  const connection = await connect();
  const sql = 'INSERT INTO Confirmaciones_Pago (id_pedido, id_usuario, comprobante_blob, comprobante_mime, comprobante_nombre) VALUES (?, ?, ?, ?, ?)';
  const [result] = await connection.execute(sql, [id_pedido, id_usuario, buffer, mime, originalName]);
  await connection.end();
  return result;
}

async function getComprobanteById(id_confirmacion) {
  const connection = await connect();
  const [rows] = await connection.execute('SELECT * FROM Confirmaciones_Pago WHERE id_confirmacion = ?', [id_confirmacion]);
  await connection.end();
  return rows[0] || null;
}

async function listComprobantes({ id_pedido, id_usuario } = {}) {
  const connection = await connect();
  let sql = 'SELECT * FROM Confirmaciones_Pago';
  const params = [];
  const clauses = [];
  if (id_pedido) { clauses.push('id_pedido = ?'); params.push(id_pedido); }
  if (id_usuario) { clauses.push('id_usuario = ?'); params.push(id_usuario); }
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  const [rows] = await connection.execute(sql, params);
  await connection.end();
  return rows;
}

module.exports = {
  createComprobante,
  getComprobanteById,
  listComprobantes
};
