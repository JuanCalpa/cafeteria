const connect = require('../../database/sqlConnection');

async function autenticarUsuario(correo, contrasena) {
    const connection = await connect();
    const [rows] = await connection.execute(
        'SELECT * FROM Usuarios WHERE correo = ? AND contraseña = ?',
        [correo, contrasena]
    );
    await connection.end();
    return rows.length > 0 ? rows[0] : null;
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