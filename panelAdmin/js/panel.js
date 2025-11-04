const modales = {
  ver: document.getElementById("modalVer"),
  editar: document.getElementById("modalEditar"),
  eliminar: document.getElementById("modalEliminar"),
  crear: document.getElementById("modalCrear"),
  editarProducto: document.getElementById("modalEditarProducto"),
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
            <button class="btn btn-eliminar" onclick="eliminarPedido(${p.id_pedido})">Eliminar</button>
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

// =================== ELIMINAR PEDIDO ===================
function eliminarPedido(id) {
  document.getElementById("detallePedidoEliminar").innerHTML = `<p>Eliminar el pedido #${id}</p>`;
  modales.eliminar.style.display = "flex";

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
        modales.eliminar.style.display = "none";
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
// Event listener will be attached dynamically when the button is created

async function cargarCategorias() {
  try {
    const res = await fetch("http://localhost:3000/api/categories");
    if (!res.ok) throw new Error("Error al cargar categorías");
    const categorias = await res.json();
    const selects = document.querySelectorAll("#productosContainer .categoria");
    selects.forEach(select => {
      select.innerHTML = '<option value="">Selecciona categoría</option>';
      categorias.forEach(cat => {
        select.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
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
    cargarPedidos();
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

// =================== CARGAR PAGOS ===================
async function cargarPagos() {
  const tbody = document.querySelector("#tablaPagos tbody");
  tbody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';

  try {
    const res = await fetch("http://localhost:3000/api/pagosPanel", { credentials: "include" });
    if (!res.ok) throw new Error("No se pudo obtener los pagos");

    const pagos = await res.json();
    tbody.innerHTML = "";

    if (!pagos.length) {
      tbody.innerHTML = `<tr><td colspan="6">No hay pagos registrados</td></tr>`;
      return;
    }

    pagos.forEach(p => {
      const productosTexto = Array.isArray(p.productos) && p.productos.length > 0
        ? p.productos.map(prod => `${prod.nombre} x${prod.cantidad}`).join(", ")
        : "Sin productos";

      tbody.innerHTML += `
        <tr>
          <td>${p.id_confirmacion}</td>
          <td>${p.id_pedido}</td>
          <td>${p.usuario}</td>
          <td>${productosTexto}</td>
          <td>
            <button class="btn btn-ver" onclick="verComprobante(${p.id_confirmacion})">Ver Comprobante</button>
          </td>
          <td>
            <button class="btn btn-editar" onclick="cambiarEstadoEntregado(${p.id_pedido})">Marcar Entregado</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="6">Error al cargar pagos</td></tr>';
  }
}

// =================== VER COMPROBANTE ===================
async function verComprobante(idConfirmacion) {
  try {
    const res = await fetch(`http://localhost:3000/api/getComprobanteFile/${idConfirmacion}`, {
      credentials: "include"
    });

    if (!res.ok) throw new Error("No se pudo obtener el comprobante");

    // Si el servidor devuelve imagen, esto la abre directamente
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  } catch (err) {
    console.error("Error al ver comprobante:", err);
    alert("Error al cargar el comprobante");
  }
}



// =================== CAMBIAR ESTADO A ENTREGADO ===================
async function cambiarEstadoEntregado(idPedido) {
  // Mostrar modal de confirmación
  document.getElementById("confirmPagoText").textContent = `¿Estás seguro de marcar el pedido #${idPedido} como entregado? Esta acción cambiará el estado del pedido a "entregado".`;
  modales.confirmPago.style.display = "flex";

  // Configurar botones de confirmación
  document.getElementById("btnConfirmPagoYes").onclick = async () => {
    modales.confirmPago.style.display = "none";
    try {
      const res = await fetch("http://localhost:3000/api/actualizarPedido", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_pedido: idPedido, estado: "entregado" })
      });

      if (!res.ok) throw new Error("Error al actualizar pedido");

      cargarPagos(); // Recargar la tabla de pagos
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("Error al cambiar el estado del pedido");
    }
  };

  document.getElementById("btnConfirmPagoNo").onclick = () => {
    modales.confirmPago.style.display = "none";
  };
}

// =================== CARGAR PRODUCTOS ===================
async function cargarProductos() {
  const tbody = document.querySelector("#tablaProductos tbody");
  tbody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';

  try {
    const res = await fetch("http://localhost:3000/api/products", { credentials: "include" });
    if (!res.ok) throw new Error("No se pudo obtener los productos");

    const productos = await res.json();
    tbody.innerHTML = "";

    if (!productos.length) {
      tbody.innerHTML = `<tr><td colspan="7">No hay productos registrados</td></tr>`;
      return;
    }

    productos.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.description || "—"}</td>
          <td>$${p.price.toLocaleString("es-CO")}</td>
          <td>${p.available === 'TRUE' ? "Disponible" : "No disponible"}</td>
          <td>${p.category}</td>
          <td>
            <button class="btn btn-editar" onclick="editarProducto(${p.id})">Editar</button>
            <button class="btn btn-eliminar" onclick="eliminarProducto(${p.id})">Eliminar</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="7">Error al cargar productos</td></tr>';
  }
}

// =================== EDITAR PRODUCTO ===================
async function editarProducto(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/productoById?id_producto=${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener el producto");

    const producto = await res.json();

    // Llenar el modal con los datos del producto
    document.getElementById("editarIdProducto").value = producto.id_producto;
    document.getElementById("editarNombre").value = producto.nombre;
    document.getElementById("editarDescripcion").value = producto.descripcion || "";
    document.getElementById("editarPrecio").value = producto.precio;
    document.getElementById("editarDisponibilidad").value = producto.disponibilidad;

    // Cargar categorías y seleccionar la actual
    await cargarCategoriasEditar(producto.categoria);

    modales.editarProducto.style.display = "flex";
  } catch (err) {
    console.error("Error al cargar producto para editar:", err);
    alert("Error al cargar el producto");
  }
}

async function cargarCategoriasEditar(categoriaSeleccionada) {
  try {
    const res = await fetch("http://localhost:3000/api/categories");
    if (!res.ok) throw new Error("Error al cargar categorías");
    const categorias = await res.json();
    const select = document.getElementById("editarCategoria");
    select.innerHTML = '<option value="">Selecciona categoría</option>';
    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      if (cat.name === categoriaSeleccionada) option.selected = true;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error al cargar categorías para editar:", err);
  }
}

document.getElementById("formEditarProducto").addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("editarIdProducto").value;
  const nombre = document.getElementById("editarNombre").value;
  const descripcion = document.getElementById("editarDescripcion").value;
  const precio = document.getElementById("editarPrecio").value;
  const disponibilidad = document.getElementById("editarDisponibilidad").value;
  const categoria = document.getElementById("editarCategoria").value;

  try {
    const res = await fetch(`http://localhost:3000/api/updateProducto/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nombre, descripcion, precio, disponibilidad, categoria })
    });

    if (!res.ok) throw new Error("Error al actualizar producto");

    modales.editarProducto.style.display = "none";
    cargarProductos();
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    alert("Error al actualizar el producto");
  }
});

// =================== ELIMINAR PRODUCTO ===================
function eliminarProducto(id) {
  // Mostrar modal de confirmación
  document.getElementById("confirmPagoText").textContent = `¿Estás seguro de eliminar el producto #${id}? Esta acción no se puede deshacer.`;
  modales.confirmPago.style.display = "flex";

  // Configurar botones de confirmación
  document.getElementById("btnConfirmPagoYes").onclick = async () => {
    modales.confirmPago.style.display = "none";
    try {
      const res = await fetch(`http://localhost:3000/api/deleteProducto/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Error al eliminar producto");

      cargarProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("Error al eliminar el producto");
    }
  };

  document.getElementById("btnConfirmPagoNo").onclick = () => {
    modales.confirmPago.style.display = "none";
  };
}

// =================== NAVEGACIÓN ENTRE PESTAÑAS ===================
document.getElementById("btnAdmin").addEventListener("click", () => {
  document.getElementById("btnAdmin").classList.add("active");
  document.getElementById("btnPagos").classList.remove("active");
  document.getElementById("btnProductos").classList.remove("active");
  document.getElementById("panelTitle").textContent = "📋 Panel de Administración";
  document.getElementById("btnContainer").innerHTML = "";
  document.getElementById("tablaPedidos").style.display = "table";
  document.getElementById("tablaPagos").style.display = "none";
  document.getElementById("tablaProductos").style.display = "none";
  cargarPedidos();
});

document.getElementById("btnPagos").addEventListener("click", () => {
  document.getElementById("btnPagos").classList.add("active");
  document.getElementById("btnAdmin").classList.remove("active");
  document.getElementById("btnProductos").classList.remove("active");
  document.getElementById("panelTitle").textContent = "💳 Panel de Pagos";
  document.getElementById("btnContainer").innerHTML = "";
  document.getElementById("tablaPedidos").style.display = "none";
  document.getElementById("tablaPagos").style.display = "table";
  document.getElementById("tablaProductos").style.display = "none";
  cargarPagos();
});

document.getElementById("btnProductos").addEventListener("click", () => {
  document.getElementById("btnProductos").classList.add("active");
  document.getElementById("btnAdmin").classList.remove("active");
  document.getElementById("btnPagos").classList.remove("active");
  document.getElementById("panelTitle").textContent = "📦 Panel de Productos";
  document.getElementById("btnContainer").innerHTML = '<button class="btn btn-nuevo" id="btnAbrirCrear">➕ Agregar Producto</button>';
  document.getElementById("tablaPedidos").style.display = "none";
  document.getElementById("tablaPagos").style.display = "none";
  document.getElementById("tablaProductos").style.display = "table";
  cargarProductos();

  // Attach event listener to the newly created button
  document.getElementById("btnAbrirCrear").addEventListener("click", () => {
    cargarCategorias();
    modales.crear.style.display = "flex";
  });
});

// =================== INICIO DE SESION ===================
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
