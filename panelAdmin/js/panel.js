document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/verificarSesion", {
      credentials: "include", // 🔑 Asegura que se envíen cookies de sesión
    });

    const data = await res.json();

    if (!res.ok || !data.usuario) {
      alert("Debes iniciar sesión para acceder al panel");
      window.location.href = "/login.html";
      return;
    }

    const usuario = data.usuario;
    console.log("Usuario autenticado:", usuario);

    // 🔒 Control de acceso según panel
    const esPanelAdmin = window.location.pathname.includes("panel.html");
    const esPanelCocina = window.location.pathname.includes("panelCocina.html");

    if (esPanelAdmin && usuario.rol !== "admin") {
      alert("Acceso denegado. Este panel es solo para administradores.");
      window.location.href = "/login.html";
      return;
    }

    if (esPanelCocina && usuario.rol !== "cocina" && usuario.rol !== "admin") {
      alert("Acceso denegado. Este panel es solo para personal de cocina o administradores.");
      window.location.href = "/login.html";
      return;
    }

    // ✅ Aquí puedes continuar cargando el contenido del panel
    console.log("Acceso autorizado al panel");

  } catch (err) {
    console.error("Error verificando sesión:", err);
    alert("Error al verificar sesión. Inicia sesión nuevamente.");
    window.location.href = "/login.html";
  }
});
