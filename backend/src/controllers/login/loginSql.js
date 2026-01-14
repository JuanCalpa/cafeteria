
const connect = require('../../database/sqlConnection');

async function autenticarUsuario(correo, contrasena) {
  console.log('🔄 Intentando autenticar usuario:', correo);
  try {
    const connection = await connect();
    console.log('✅ Conexión a BD establecida');

    const [rows] = await connection.execute(
      'SELECT * FROM Usuarios WHERE correo = ? AND contraseña = ?',
      [correo, contrasena]
    );
    console.log('✅ Query ejecutada, resultados:', rows.length);

    await connection.end();
    console.log('✅ Conexión cerrada');

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('❌ Error en autenticarUsuario:', error);
    throw error;
  }
}

async function registrarUsuario(correo, contrasena, nombre, rol, fecha_registro) {
  const connection = await connect();
  const [result] = await connection.execute(
    'INSERT INTO Usuarios (correo, contraseña, nombre, rol, fecha_registro) VALUES (?, ?, ?, ?, ?)',
    [correo, contrasena, nombre, rol, fecha_registro]
  );
  await connection.end();
  return result;
}

module.exports = {
  autenticarUsuario,
  registrarUsuario
};
