const loginSql = require('./loginSql');

async function registro(req, res) {
    const { correo, contrasena, nombre, rol, fecha_registro } = req.body;
    console.log('Datos recibidos para registro:', { correo, contrasena, nombre, rol, fecha_registro });

    try {
        const resultado = await loginSql.registrarUsuario(correo, contrasena, nombre, rol, fecha_registro);
        if (resultado.affectedRows > 0) {
            res.status(201).json({ mensaje: 'Usuario registrado exitosamente', id: resultado.insertId });
        } else {
            res.status(400).json({ mensaje: 'No se pudo registrar el usuario' });
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
}

async function login(req, res) {
    const { correo, contrasena } = req.body;
    console.log('Datos recibidos en el backend:', { correo, contrasena });

    try {
        const usuario = await loginSql.autenticarUsuario(correo, contrasena);
        console.log('Resultado usuario:', usuario);
        if (usuario) {
            req.session.usuario = {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                rol: usuario.rol
            };
            console.log('Login como usuario');
            console.log('SESION:', req.session);
            return res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario, tipo: 'usuario' });
        }
        // 
        res.status(401).json({ mensaje: 'Credenciales inválidas' });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error del servidor', error });
    }
}

async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).json({ mensaje: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ mensaje: 'Sesión cerrada exitosamente' });
    });
}

module.exports = {
    registro,
    login,
    logout
};
