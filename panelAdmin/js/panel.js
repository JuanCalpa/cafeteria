const modales = {
  ver: document.getElementById("modalVer"),
  editar: document.getElementById("modalEditar"),
  pago: document.getElementById("modalPago"),
  crear: document.getElementById("modalCrear"),
  confirmEdit: document.getElementById("modalConfirmEdit"),
  confirmPago: document.getElementById("modalConfirmPago"),
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
          <td>$${p.total ? Number(p.total).toLocaleString("es-CO") : '0'}</td>
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

// =================== VER PEDIDO ===================
async function verPedido(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/pedidosPanel/${id}`);
    if (res.status === 404) {
      alert("⚠️ Pedido no encontrado en la base de datos.");
      return;
    }
    if (!res.ok) throw new Error("Error al obtener el pedido");

    const pedido = await res.json();

    // Asegurar consistencia de campos
    const productos = Array.isArray(pedido.productos) ? pedido.productos : [];

    const detalle = document.getElementById("detallePedidoVer");
    detalle.innerHTML = `
      <p><b>ID Pedido:</b> ${pedido.id_pedido ?? "N/A"}</p>
      <p><b>Usuario:</b> ${pedido.usuario ?? "Desconocido"}</p>
      <p><b>Correo:</b> ${pedido.correo ?? "—"}</p>
      <p><b>Estado:</b> ${pedido.estado ?? "—"}</p>
      <p><b>Fecha:</b> ${pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleString() : "—"}</p>
      <p><b>Total:</b> $${pedido.total ? Number(pedido.total).toLocaleString("es-CO") : "0"}</p>
      <h3>🧾 Productos</h3>
      ${
        productos.length > 0
          ? `<ul>${productos.map(p => {
              const nombre = p.nombre || "Producto sin nombre";
              const cantidad = p.cantidad || 0;
              const subtotal = p.subtotal ? Number(p.subtotal).toLocaleString("es-CO") : "0";
              return `<li>${nombre} x${cantidad} — $${subtotal}</li>`;
            }).join("")}</ul>`
          : (pedido.productos && typeof pedido.productos === "string"
              ? `<p>${pedido.productos}</p>`
              : "<p>❌ No hay productos asociados a este pedido.</p>")
      }
    `;

    modales.ver.style.display = "flex";
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

  // Mostrar modal de confirmación
  document.getElementById("confirmEditText").textContent = `¿Estás seguro de cambiar el estado del pedido #${id} a "${estado}"?`;
  modales.confirmEdit.style.display = "flex";

  // Configurar botones de confirmación
  document.getElementById("btnConfirmEditYes").onclick = async () => {
    modales.confirmEdit.style.display = "none";
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
  };

  document.getElementById("btnConfirmEditNo").onclick = () => {
    modales.confirmEdit.style.display = "none";
  };
});

// =================== PAGO PEDIDO ===================
function pagoPedido(id) {
  document.getElementById("detallePedidoPago").innerHTML = `<p>Gestión del pedido #${id}</p>`;
  modales.pago.style.display = "flex";

  document.getElementById("btnCambiarPagado").onclick = async () => {
    // Mostrar modal de confirmación
    document.getElementById("confirmPagoText").textContent = `¿Estás seguro de marcar el pedido #${id} como entregado?`;
    modales.confirmPago.style.display = "flex";

    // Configurar botones de confirmación
    document.getElementById("btnConfirmPagoYes").onclick = async () => {
      modales.confirmPago.style.display = "none";
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

    document.getElementById("btnConfirmPagoNo").onclick = () => {
      modales.confirmPago.style.display = "none";
    };
  };

  document.getElementById("btnEliminarPedido").onclick = async () => {
    // Mostrar modal de confirmación
    document.getElementById("confirmPagoText").textContent = `¿Estás seguro de cancelar y eliminar el pedido #${id}? Esta acción no se puede deshacer.`;
    modales.confirmPago.style.display = "flex";

    // Configurar botones de confirmación
    document.getElementById("btnConfirmPagoYes").onclick = async () => {
      modales.confirmPago.style.display = "none";
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

    document.getElementById("btnConfirmPagoNo").onclick = () => {
      modales.confirmPago.style.display = "none";
    };
  };
}

// =================== AGREGAR PRODUCTO ===================
document.getElementById("btnAbrirCrear").addEventListener("click", () => {
  cargarCategorias();
  modales.crear.style.display = "flex";
});

async function cargarCategorias() {
  try {
    const res = await fetch("http://localhost:3000/api/categorias");
    if (!res.ok) throw new Error("Error al cargar categorías");
    const categorias = await res.json();
    const selects = document.querySelectorAll("#productosContainer .categoria");
    selects.forEach(select => {
      select.innerHTML = '<option value="">Selecciona categoría</option>';
      categorias.forEach(cat => {
        select.innerHTML += `<option value="${cat}">${cat}</option>`;
      });
    });
  } catch (err) {
    console.error("Error al cargar categorías:", err);
  }
}

document.getElementById("btnAgregarOtroProducto").addEventListener("click", () => {
  const container = document.getElementById("productosContainer");
  const newItem = container.querySelector(".producto-item").cloneNode(true);
  newItem.querySelectorAll("input").forEach(input => input.value = "");
  newItem.querySelector(".categoria").innerHTML = '<option value="">Selecciona categoría</option>';
  cargarCategorias(); 
  container.appendChild(newItem);
  newItem.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById("productosContainer").addEventListener("click", e => {
  if (e.target.classList.contains("remove-producto")) {
    const items = document.querySelectorAll("#productosContainer .producto-item");
    if (items.length > 1) {
      e.target.closest(".producto-item").remove();
    }
  }
});

document.getElementById("formCrearProducto").addEventListener("submit", async e => {
  e.preventDefault();

  const productos = [];
  const items = document.querySelectorAll("#productosContainer .producto-item");

  items.forEach(item => {
    const categoria = item.querySelector(".categoria").value;
    const nombre = item.querySelector(".nombre").value;
    const descripcion = item.querySelector(".descripcion").value;
    const precio = item.querySelector(".precio").value;
    const disponibilidad = item.querySelector(".disponibilidad").value;

    if (categoria && nombre && precio) {
      productos.push({
        nombre,
        descripcion,
        precio,
        disponibilidad,
        categoria
      });
    }
  });

  if (productos.length === 0) {
    alert("Agrega al menos un producto válido.");
    return;
  }

  try {
    for (const prod of productos) {
      const res = await fetch("http://localhost:3000/api/createProducto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(prod)
      });
      if (!res.ok) throw new Error("Error al crear producto");
    }

    modales.crear.style.display = "none";
    e.target.reset();
    // Reset container to one item
    document.getElementById("productosContainer").innerHTML = `
      <div class="producto-item">
        <label>Categoría:</label>
        <select class="categoria" required>
          <option value="">Selecciona categoría</option>
        </select>
        <label>Nombre:</label>
        <input type="text" class="nombre" placeholder="Ej: Café" required>
        <label>Descripción:</label>
        <input type="text" class="descripcion" placeholder="Ej: Café negro">
        <label>Precio:</label>
        <input type="text" class="precio" placeholder="Ej: $2,500" required>
        <label>Disponibilidad:</label>
        <select class="disponibilidad" required>
          <option value="TRUE">Disponible</option>
          <option value="FALSE">No disponible</option>
        </select>
        <button type="button" class="btn btn-eliminar remove-producto">❌ Remover</button>
      </div>
    `;
    cargarPedidos(); // Opcional, si quieres recargar algo
  } catch (err) {
    console.error("Error al crear productos:", err);
  }
});

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

// =================== INICIO ===================
window.addEventListener("DOMContentLoaded", async () => {
  // Verificar sesión
  try {
    const res = await fetch("http://localhost:3000/api/verificarSesion", { credentials: "include" });
    const data = await res.json();

    if (!res.ok || data.usuario.rol !== 'administrador') {
      alert("Acceso denegado. Solo para administradores.");
      window.location.href = "/";
      return;
    }
  } catch (err) {
    console.error("Error al verificar sesión:", err);
    window.location.href = "/";
  }

  cargarPedidos();
});
