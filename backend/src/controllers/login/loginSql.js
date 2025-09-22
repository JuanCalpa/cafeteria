const connect = require('../../database/sqlConnection');

async function autenticarUsuario(correo, contrasena) {
    const connection = await connect();
    const [rows] = await connection.execute(
        'SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?',
        [correo, contrasena]
    );
    await connection.end();
    return rows.length > 0 ? rows[0] : null;
}

module.exports = { 
    autenticarUsuario
};