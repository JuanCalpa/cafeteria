function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    // Permitir acceso sin sesión (modo desarrollo)
    if (!req.session || !req.session.usuario) {
      console.warn('⚠️ Sin sesión activa, permitiendo acceso temporalmente (modo desarrollo)');
      return next();
    }

    const rolUsuario = req.session.usuario.rol;
    console.log('Rol del usuario:', rolUsuario);
    console.log('Roles permitidos:', rolesPermitidos);

    if (!rolesPermitidos.includes(rolUsuario)) {
      console.warn(`🚫 Acceso denegado para el rol: ${rolUsuario}`);
      return res.status(403).json({ mensaje: `Acceso denegado para el rol: ${rolUsuario}` });
    }

    next();
  };
}

module.exports = verificarRol;
