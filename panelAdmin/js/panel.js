const modales = {
  ver: document.getElementById("modalVer"),
  editar: document.getElementById("modalEditar"),
  pago: document.getElementById("modalPago"),
  crear: document.getElementById("modalCrear")
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

// =================== CARGAR PEDIDOS ===================
async function cargarPedidos() {
  const tbody = document.querySelector("#tablaPedidos tbody");
  tbody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';

  try {
    const res = await fetch("http://localhost:3000/api/pedidosPanel", { credentials: "include" });
    if (!res.ok) throw new Error("No se pudo obtener los pedidos");

    const pedidos = await res.json();
    tbody.innerHTML = "";

    if (!pedidos.length) {
      tbody.innerHTML = `<tr><td colspan="7">No hay pedidos registrados</td></tr>`;
      return;
    }

    pedidos.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${p.id_pedido}</td>
          <td>${p.usuario}</td>
          <td>${p.correo}</td>
          <td>${p.estado}</td>
          <td>${new Date(p.fecha_pedido).toLocaleString()}</td>
          <td>
            <button class="btn btn-ver" onclick="verPedido(${p.id_pedido})">Ver</button>
            <button class="btn btn-editar" onclick="editarPedido(${p.id_pedido})">Editar</button>
            <button class="btn btn-pagar" onclick="pagoPedido(${p.id_pedido})">Pago</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="7">Error al cargar pedidos</td></tr>';
  }
}

async function verPedido(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/pedidosPanel/${id}`);
    if (res.status === 404) {
      alert("⚠️ Pedido no encontrado en la base de datos.");
      return;
    }
    if (!res.ok) throw new Error("Error al obtener el pedido");

    const pedido = await res.json();

    // Validar productos antes de mostrar
    const productos = Array.isArray(pedido.productos) ? pedido.productos : [];

    const detalle = document.getElementById("detallePedidoVer");
    detalle.innerHTML = `
      <p><b>ID Pedido:</b> ${pedido.id ?? "N/A"}</p>
      <p><b>Usuario:</b> ${pedido.usuario ?? "Desconocido"}</p>
      <p><b>Correo:</b> ${pedido.correo ?? "—"}</p>
      <p><b>Estado:</b> ${pedido.estado ?? "—"}</p>
      <p><b>Fecha:</b> ${pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleString() : "—"}</p>
      <p><b>Total:</b> $${pedido.total ? pedido.total.toLocaleString() : "0"}</p>
      <h3>🧾 Productos</h3>
      ${
  productos.length > 0
    ? `<ul>${productos.map(p => {
        const nombre = p.nombre || "Producto sin nombre";
        const cantidad = p.cantidad || 0;
        const subtotal = p.subtotal ? Number(p.subtotal).toLocaleString("es-CO") : "0";
        return `<li>${nombre} x${cantidad} — $${subtotal}</li>`;
      }).join("")}</ul>`
    : "<p>❌ No hay productos asociados a este pedido.</p>"
}
    `;
    

    modalVer.style.display = "flex";
  } catch (error) {
    console.error("Error en verPedido:", error);
    alert("❌ Ocurrió un error al obtener el pedido.");
  }
}


// =================== EDITAR PEDIDO ===================
function editarPedido(id) {
  document.getElementById("editarIdPedido").value = id;
  modales.editar.style.display = "flex";
}

document.getElementById("formEditarPedido").addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("editarIdPedido").value;
  const estado = document.getElementById("editarEstado").value;

  try {
    const res = await fetch("http://localhost:3000/api/actualizarPedido", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id_pedido: id, estado })
    });

    if (!res.ok) throw new Error("Error al actualizar pedido");

    modales.editar.style.display = "none";
    cargarPedidos();
  } catch (err) {
    console.error("Error al actualizar:", err);
  }
});

// =================== PAGO PEDIDO ===================
function pagoPedido(id) {
  document.getElementById("detallePedidoPago").innerHTML = `<p>Gestión del pedido #${id}</p>`;
  modales.pago.style.display = "flex";

  document.getElementById("btnCambiarPagado").onclick = async () => {
    try {
      await fetch("http://localhost:3000/api/actualizarPedido", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_pedido: id, estado: "entregado" })
      });
      modales.pago.style.display = "none";
      cargarPedidos();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  document.getElementById("btnEliminarPedido").onclick = async () => {
    try {
      await fetch("http://localhost:3000/api/cancelarPedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_pedido: id })
      });
      modales.pago.style.display = "none";
      cargarPedidos();
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
    }
  };
}

// =================== CREAR PEDIDO MANUAL ===================
document.getElementById("btnAbrirCrear").addEventListener("click", () => {
  modales.crear.style.display = "flex";
});

document.getElementById("formCrearPedido").addEventListener("submit", async e => {
  e.preventDefault();

  // Ejemplo simple para crear un pedido manual
  const id_usuario = 1; // Puedes cambiarlo por un select más adelante
  const id_producto = 1;
  const cantidad = 1;

  try {
    const res = await fetch("http://localhost:3000/api/crearPedidoManual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id_usuario,
        productos: [{ id_producto, cantidad }]
      })
    });

    if (!res.ok) throw new Error("Error al crear pedido");

    modales.crear.style.display = "none";
    e.target.reset();
    cargarPedidos();
  } catch (err) {
    console.error("Error al crear pedido manual:", err);
  }
});

// =================== INICIO ===================
window.addEventListener("DOMContentLoaded", cargarPedidos);
