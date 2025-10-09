document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/verificarSesion", {
      credentials: "include", // 🔑 Asegura que se envíen cookies de sesión
    });

    const data = await res.json();

    if (!res.ok || !data.usuario) {
      alert("Debes iniciar sesión para acceder al panel");
      window.location.href = "/panelAdmin/frontend/index.html";
      return;
    }

    const usuario = data.usuario;
    console.log("Usuario autenticado:", usuario);

    // 🔒 Control de acceso según panel
    const esPanelAdmin = window.location.pathname.includes("panel.html");
    const esPanelCocina = window.location.pathname.includes("panelCocina.html");

    if (esPanelAdmin && usuario.rol !== "admin" && usuario.rol !== "administrador") {
      alert("Acceso denegado. Este panel es solo para administradores.");
      window.location.href = "/panelAdmin/frontend/index.html";
      return;
    }

    if (esPanelCocina && usuario.rol !== "cocina" && usuario.rol !== "admin") {
      alert("Acceso denegado. Este panel es solo para personal de cocina o administradores.");
      window.location.href = "/panelAdmin/frontend/index.html";
      return;
    }

    // ✅ Aquí puedes continuar cargando el contenido del panel
    console.log("Acceso autorizado al panel");

    // Cargar pedidos en el panel admin
    if (esPanelAdmin) {
      cargarPedidosPanel();
    }

    async function cargarPedidosPanel() {
      const tabla = document.getElementById('tablaPedidos');
      const tbody = tabla ? tabla.querySelector('tbody') : null;
      if (!tbody) return;

      tbody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';
      try {
        const res = await fetch('/api/pedidosPanel', { credentials: 'include' });
        if (!res.ok) {
          const error = await res.json();
          console.error('Error al obtener pedidos:', error);
          tbody.innerHTML = `<tr><td colspan="7">Error: ${error.error || 'No autorizado'}</td></tr>`;
          return;
        }
        const pedidos = await res.json();
        tbody.innerHTML = '';
        pedidos.forEach(pedido => {
          tbody.innerHTML += `
            <tr>
              <td>${pedido.id_pedido}</td>
              <td>${pedido.usuario}</td>
              <td>${pedido.correo}</td>
              <td>${pedido.estado}</td>
              <td>${new Date(pedido.fecha_pedido).toLocaleString()}</td>
              <td>${pedido.productos || ''}</td>
              <td>
                <button onclick="verPedido('${pedido.id_pedido}')" class="btn btn-ver">Ver</button>
                <button onclick="editarPedido('${pedido.id_pedido}')" class="btn btn-editar">Editar</button>
                <button onclick="pagoPedido('${pedido.id_pedido}')" class="btn btn-pago">Pago</button>
              </td>
            </tr>
          `;
        });
      } catch (err) {
        console.error('Error de conexión:', err);
        if (tbody) tbody.innerHTML = '<tr><td colspan="7">Error de conexión</td></tr>';
      }
    }

    window.verPedido = async function(id_pedido) {
      const modal = document.getElementById('modalVer');
      const detalle = document.getElementById('detallePedidoVer');
      detalle.innerHTML = 'Cargando...';
      modal.style.display = 'flex';

      try {
        const res = await fetch(`/api/pedidosPanel?id_pedido=${id_pedido}`, { credentials: 'include' });
        const pedido = await res.json();
        detalle.innerHTML = `
          <strong>ID:</strong> ${pedido.id_pedido}<br>
          <strong>Usuario:</strong> ${pedido.usuario}<br>
          <strong>Correo:</strong> ${pedido.correo}<br>
          <strong>Estado:</strong> ${pedido.estado}<br>
          <strong>Fecha:</strong> ${new Date(pedido.fecha_pedido).toLocaleString()}<br>
          <strong>Productos:</strong> ${pedido.productos || ''}<br>
        `;
      } catch (err) {
        detalle.innerHTML = 'Error al cargar detalles';
      }
    };

    document.getElementById('cerrarModalVer').onclick = () => {
      document.getElementById('modalVer').style.display = 'none';
    };

    window.editarPedido = async function(id_pedido) {
      const modal = document.getElementById('modalEditar');
      modal.style.display = 'flex';
      document.getElementById('editarIdPedido').value = id_pedido;

      // Opcional: cargar estado actual del pedido
      try {
        const res = await fetch(`/api/pedidosPanel?id_pedido=${id_pedido}`, { credentials: 'include' });
        const pedido = await res.json();
        document.getElementById('editarEstado').value = pedido.estado;
      } catch {}
    };

    document.getElementById('cerrarModalEditar').onclick = () => {
      document.getElementById('modalEditar').style.display = 'none';
    };

    document.getElementById('formEditarPedido').onsubmit = async function(e) {
      e.preventDefault();
      const id_pedido = document.getElementById('editarIdPedido').value;
      const estado = document.getElementById('editarEstado').value;
      if (!confirm('¿Seguro que deseas guardar los cambios?')) return;
      try {
        const res = await fetch('/api/actualizarPedido', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_pedido, estado })
        });
        const data = await res.json();
        if (data.success) {
          alert('Pedido actualizado correctamente');
          document.getElementById('modalEditar').style.display = 'none';
          cargarPedidosPanel();
        } else {
          alert(data.message || 'No se pudo actualizar el pedido');
        }
      } catch (err) {
        alert('Error al actualizar el pedido');
      }
    };

    window.pagoPedido = async function(id_pedido) {
      const modal = document.getElementById('modalPago');
      const detalle = document.getElementById('detallePedidoPago');
      modal.style.display = 'flex';
      detalle.innerHTML = 'Cargando...';

      try {
        const res = await fetch(`/api/pedidosPanel?id_pedido=${id_pedido}`, { credentials: 'include' });
        const pedido = await res.json();
        // Si el backend no devuelve el total, puedes calcularlo aquí si tienes los precios
        detalle.innerHTML = `
          <strong>ID:</strong> ${pedido.id_pedido}<br>
          <strong>Usuario:</strong> ${pedido.usuario}<br>
          <strong>Estado:</strong> ${pedido.estado}<br>
          <strong>Valor Total:</strong> $${pedido.total || 'No disponible'}<br>
        `;
        document.getElementById('btnCambiarPagado').onclick = async function() {
          if (!confirm('¿Seguro que deseas cambiar el estado a pagado?')) return;
          try {
            const res = await fetch('/api/actualizarPedido', {
              method: 'PUT',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id_pedido, estado: 'pagado' })
            });
            const data = await res.json();
            if (data.success) {
              alert('Estado cambiado a pagado');
              modal.style.display = 'none';
              cargarPedidosPanel();
            } else {
              alert(data.message || 'No se pudo cambiar el estado');
            }
          } catch (err) {
            alert('Error al cambiar estado');
          }
        };
        document.getElementById('btnEliminarPedido').onclick = async function() {
          if (!confirm('¿Seguro que deseas eliminar este pedido?')) return;
          try {
            const res = await fetch('/api/cancelarPedido', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id_pedido })
            });
            const data = await res.json();
            if (data.success) {
              alert('Pedido eliminado correctamente');
              modal.style.display = 'none';
              cargarPedidosPanel();
            } else {
              alert(data.message || 'No se pudo eliminar el pedido');
            }
          } catch (err) {
            alert('Error al eliminar el pedido');
          }
        };
      } catch (err) {
        detalle.innerHTML = 'Error al cargar detalles';
      }
    };

    document.getElementById('cerrarModalPago').onclick = () => {
      document.getElementById('modalPago').style.display = 'none';
    };

  } catch (err) {
    console.error("Error verificando sesión:", err);
    alert("Error al verificar sesión. Inicia sesión nuevamente.");
    window.location.href = "/panelAdmin/frontend/index.html";
  }
});
