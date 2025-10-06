
function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ mensaje: 'No hay sesión activa o expiró' });
    }

    const rolUsuario = req.session.usuario.rol;

    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ mensaje: `Acceso denegado para el rol: ${rolUsuario}` });
    }

    next(); // Usuario autorizado
  };
}

module.exports = verificarRol;
