function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    // Skip rol check for login and registro to allow all registered users
    if (req.originalUrl.startsWith('/api/login') || req.originalUrl.startsWith('/api/registro')) {
      return next();
    }



    const rolUsuario = req.session.usuario.rol;
    console.log('Rol del usuario:', rolUsuario);
    console.log('Roles permitidos:', rolesPermitidos);

    if (!rolesPermitidos.includes(rolUsuario)) {
      console.warn(`🚫 Acceso denegado: rol no autorizado.`);
      return res.status(403).json({ mensaje: `Acceso denegado: rol no autorizado.` });
    }

    next();
  };
}

module.exports = verificarRol;
