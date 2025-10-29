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

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Guardar sesión
    req.session.usuario = {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      rol: usuario.rol,
      correo: usuario.correo
    };

    console.log('Sesión activa:', req.session.usuario);

    // Determinar destino basado en el rol
    let destino;
    if (usuario.rol === 'administrador') {
      destino = '/panelAdmin/frontend/panel.html';
    } else if (usuario.rol === 'cocina') {
      destino = '/panelAdmin/frontend/panelCocina.html';
    } else {
      // Para otros roles, redirigir al login o página principal
      destino = '/';
    }

    console.log('Login exitoso para rol:', usuario.rol, 'destino:', destino);
    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: req.session.usuario,
      rol: usuario.rol,
      destino: destino
    });

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
