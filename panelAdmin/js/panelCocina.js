// panelAdmin/js/panelCocina.js

const modales = {
  confirmLogout: document.getElementById("modalConfirmLogout")
};

// =================== CERRAR MODALES ===================
document.querySelectorAll(".close").forEach(btn => {
  btn.addEventListener("click", () => {
    Object.values(modales).forEach(m => (m.style.display = "none"));
  });
});

window.addEventListener("click", e => {
  Object.values(modales).forEach(m => {
    if (e.target === m) m.style.display = "none";
  });
});

// Verificar sesión al cargar la página
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/verificarSesion", { credentials: "include" });
    const data = await res.json();

    if (!res.ok || data.usuario.rol !== 'cocina') {
      alert("Acceso denegado. Solo para rol cocina.");
      window.location.href = "/";
      return;
    }

    cargarPedidosCocina();
  } catch (err) {
    console.error("Error al verificar sesión:", err);
    window.location.href = "/";
  }
});

// Cargar pedidos para cocina
async function cargarPedidosCocina() {
  const tbody = document.querySelector("#tablaPedidosCocina tbody");
  tbody.innerHTML = '<tr><td colspan="3">Cargando...</td></tr>';

  try {
    const res = await fetch("http://localhost:3000/api/pedidosCocina", { credentials: "include" });
    if (!res.ok) throw new Error("No se pudo obtener los pedidos");

    const pedidos = await res.json();
    tbody.innerHTML = "";

    if (!pedidos.length) {
      tbody.innerHTML = `<tr><td colspan="3">No hay pedidos registrados</td></tr>`;
      return;
    }

    pedidos.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${p.id_pedido}</td>
          <td>${p.usuario}</td>
          <td>${p.productos_especificaciones}</td>
        </tr>`;
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="3">Error al cargar pedidos</td></tr>';
  }
}

// =================== CERRAR SESIÓN ===================
document.getElementById("btnLogout").addEventListener("click", () => {
  modales.confirmLogout.style.display = "flex";
});

document.getElementById("btnConfirmLogoutYes").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include"
    });
    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("Error al cerrar sesión");
    }
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
    alert("Error al cerrar sesión");
  }
});

document.getElementById("btnConfirmLogoutNo").addEventListener("click", () => {
  modales.confirmLogout.style.display = "none";
});
