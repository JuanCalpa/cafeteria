import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { pedidosAPI, pagosAPI, productosAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalCrearProducto from '../components/ModalCrearProducto';
import ModalEditarProducto from '../components/ModalEditarProducto';
import '../assets/panel.css';

const PanelAdmin = () => {
  const [vistaActual, setVistaActual] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modales
  const [modalVer, setModalVer] = useState({ open: false, data: null });
  const [modalEditar, setModalEditar] = useState({ open: false, data: null });
  const [modalEliminar, setModalEliminar] = useState({ open: false, id: null });
  const [modalCrearProducto, setModalCrearProducto] = useState(false);
  const [modalEditarProducto, setModalEditarProducto] = useState({ open: false, data: null });
  
  // Confirmaciones
  const [confirmEdit, setConfirmEdit] = useState({ open: false, id: null, estado: null });
  const [confirmPago, setConfirmPago] = useState({ open: false, action: null, id: null });
  const [confirmLogout, setConfirmLogout] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (vistaActual === 'pedidos') {
      cargarPedidos();
    } else if (vistaActual === 'pagos') {
      cargarPagos();
    } else if (vistaActual === 'productos') {
      cargarProductos();
    }
  }, [vistaActual]);

  // =================== CARGAR DATOS ===================
  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const data = await pedidosAPI.getAll();
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarPagos = async () => {
    setLoading(true);
    try {
      const data = await pagosAPI.getAll();
      setPagos(data);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const data = await productosAPI.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // =================== PEDIDOS ===================
  const verPedido = async (id) => {
    try {
      const data = await pedidosAPI.getById(id);
      setModalVer({ open: true, data });
    } catch (error) {
      console.error('Error al ver pedido:', error);
      alert('Error al cargar el pedido');
    }
  };

  const abrirEditarPedido = (id) => {
    const pedido = pedidos.find(p => p.id_pedido === id);
    setModalEditar({ open: true, data: { id, estado: pedido?.estado || 'pendiente' } });
  };

  const guardarEditarPedido = (id, estado) => {
    setModalEditar({ open: false, data: null });
    setConfirmEdit({ open: true, id, estado });
  };

  const confirmarEditarPedido = async () => {
    const { id, estado } = confirmEdit;
    try {
      await pedidosAPI.actualizar(id, estado);
      setConfirmEdit({ open: false, id: null, estado: null });
      cargarPedidos();
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      alert('Error al actualizar el pedido');
    }
  };

  const abrirEliminarPedido = (id) => {
    setModalEliminar({ open: true, id });
  };

  const confirmarEliminarPedido = async () => {
    const id = modalEliminar.id;
    setModalEliminar({ open: false, id: null });
    setConfirmPago({
      open: true,
      action: 'eliminar',
      id,
      message: `¿Estás seguro de cancelar y eliminar el pedido #${id}? Esta acción no se puede deshacer.`
    });
  };

  const ejecutarEliminarPedido = async (id) => {
    try {
      await pedidosAPI.cancelar(id);
      setConfirmPago({ open: false, action: null, id: null });
      cargarPedidos();
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      alert('Error al eliminar el pedido');
    }
  };

  // =================== PAGOS ===================
  const verComprobante = (id_confirmacion) => {
    const url = pagosAPI.getComprobante(id_confirmacion);
    window.open(url, '_blank');
  };

  const marcarEntregado = (id_pedido) => {
    setConfirmPago({
      open: true,
      action: 'entregar',
      id: id_pedido,
      message: `¿Estás seguro de marcar el pedido #${id_pedido} como entregado?`
    });
  };

  const ejecutarMarcarEntregado = async (id_pedido) => {
    try {
      await pedidosAPI.actualizar(id_pedido, 'entregado');
      setConfirmPago({ open: false, action: null, id: null });
      cargarPagos();
    } catch (error) {
      console.error('Error al marcar como entregado:', error);
      alert('Error al actualizar el pedido');
    }
  };

  // =================== PRODUCTOS ===================
  const eliminarProducto = (id) => {
    setConfirmPago({
      open: true,
      action: 'eliminarProducto',
      id,
      message: `¿Estás seguro de eliminar el producto #${id}? Esta acción no se puede deshacer.`
    });
  };

  const ejecutarEliminarProducto = async (id) => {
    try {
      await productosAPI.eliminar(id);
      setConfirmPago({ open: false, action: null, id: null });
      cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  const abrirEditarProducto = async (id) => {
    try {
      const data = await productosAPI.getById(id);
      setModalEditarProducto({ open: true, data });
    } catch (error) {
      console.error('Error al cargar producto:', error);
      alert('Error al cargar el producto');
    }
  };

  // =================== LOGOUT ===================
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  // =================== SIDEBAR ===================
  const sidebarItems = [
    { id: 'pedidos', label: 'Panel Administración', onClick: () => setVistaActual('pedidos') },
    { id: 'pagos', label: 'Pagos', onClick: () => setVistaActual('pagos') },
    { id: 'productos', label: 'Productos', onClick: () => setVistaActual('productos') }
  ];

  return (
    <div className="panel-layout">
      <Sidebar 
        items={sidebarItems} 
        onLogout={() => setConfirmLogout(true)} 
      />
      
      <div className="main-content">
        <div className="panel-header">
          <h1>
            {vistaActual === 'pedidos' && '📋 Panel de Administración'}
            {vistaActual === 'pagos' && '💳 Panel de Pagos'}
            {vistaActual === 'productos' && '📦 Panel de Productos'}
          </h1>
          {vistaActual === 'productos' && (
            <button className="btn btn-nuevo" onClick={() => setModalCrearProducto(true)}>
              ➕ Agregar Producto
            </button>
          )}
        </div>

        {/* TABLA PEDIDOS */}
        {vistaActual === 'pedidos' && (
          <TablaPedidos 
            pedidos={pedidos}
            loading={loading}
            onVer={verPedido}
            onEditar={abrirEditarPedido}
            onEliminar={abrirEliminarPedido}
          />
        )}

        {/* TABLA PAGOS */}
        {vistaActual === 'pagos' && (
          <TablaPagos
            pagos={pagos}
            loading={loading}
            onVerComprobante={verComprobante}
            onMarcarEntregado={marcarEntregado}
          />
        )}

        {/* TABLA PRODUCTOS */}
        {vistaActual === 'productos' && (
          <TablaProductos
            productos={productos}
            loading={loading}
            onEditar={abrirEditarProducto}
            onEliminar={eliminarProducto}
          />
        )}
      </div>

      {/* MODALES DE PEDIDOS */}
      <ModalVerPedido modal={modalVer} onClose={() => setModalVer({ open: false, data: null })} />
      <ModalEditarPedido 
        modal={modalEditar} 
        onClose={() => setModalEditar({ open: false, data: null })}
        onGuardar={guardarEditarPedido}
      />
      <ModalEliminarPedido
        modal={modalEliminar}
        onClose={() => setModalEliminar({ open: false, id: null })}
        onEliminar={confirmarEliminarPedido}
      />

      {/* MODALES DE PRODUCTOS */}
      <ModalCrearProducto
        isOpen={modalCrearProducto}
        onClose={() => setModalCrearProducto(false)}
        onSuccess={cargarProductos}
      />
      <ModalEditarProducto
        modal={modalEditarProducto}
        onClose={() => setModalEditarProducto({ open: false, data: null })}
        onSuccess={cargarProductos}
      />

      {/* CONFIRMACIONES */}
      <ConfirmDialog
        isOpen={confirmEdit.open}
        onClose={() => setConfirmEdit({ open: false, id: null, estado: null })}
        onConfirm={confirmarEditarPedido}
        title="⚠️ Confirmar Cambio de Estado"
        message={`¿Estás seguro de cambiar el estado del pedido #${confirmEdit.id} a "${confirmEdit.estado}"?`}
        confirmText="Sí, Cambiar"
      />

      <ConfirmDialog
        isOpen={confirmPago.open}
        onClose={() => setConfirmPago({ open: false, action: null, id: null })}
        onConfirm={() => {
          if (confirmPago.action === 'eliminar') {
            ejecutarEliminarPedido(confirmPago.id);
          } else if (confirmPago.action === 'entregar') {
            ejecutarMarcarEntregado(confirmPago.id);
          } else if (confirmPago.action === 'eliminarProducto') {
            ejecutarEliminarProducto(confirmPago.id);
          }
        }}
        title="⚠️ Confirmar Acción"
        message={confirmPago.message}
        confirmText="Sí, Proceder"
      />

      <ConfirmDialog
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="⚠️ Cerrar Sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmText="Sí, Cerrar Sesión"
      />
    </div>
  );
};

// =================== COMPONENTES DE TABLAS ===================
const TablaPedidos = ({ pedidos, loading, onVer, onEditar, onEliminar }) => {
  if (loading) return <div className="loading">☕ Cargando pedidos...</div>;
  if (pedidos.length === 0) return <div className="empty-state">📭 No hay pedidos registrados</div>;

  return (
    <div className="cards-container">
      {pedidos.map((p) => (
        <div key={p.id_pedido} className="pedido-card">
          <div className="card-header">
            <div className="card-id">Pedido #{p.id_pedido}</div>
            <div className={`card-estado estado-${p.estado.replace(' ', '-')}`}>
              {p.estado}
            </div>
          </div>
          <div className="card-body">
            <div className="card-info">
              <div className="card-info-row">
                <span className="card-info-label">👤 Usuario:</span>
                <span className="card-info-value">{p.usuario}</span>
              </div>
              <div className="card-info-row">
                <span className="card-info-label">📧 Correo:</span>
                <span className="card-info-value">{p.correo}</span>
              </div>
              <div className="card-total">
                💰 ${p.total ? Number(p.total).toLocaleString('es-CO') : '0'}
              </div>
            </div>
          </div>
          <div className="card-actions">
            <button className="btn btn-ver" onClick={() => onVer(p.id_pedido)}>👁️ Ver</button>
            <button className="btn btn-editar" onClick={() => onEditar(p.id_pedido)}>✏️ Editar</button>
            <button className="btn btn-eliminar" onClick={() => onEliminar(p.id_pedido)}>🗑️ Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const TablaPagos = ({ pagos, loading, onVerComprobante, onMarcarEntregado }) => {
  if (loading) return <div className="loading">☕ Cargando pagos...</div>;
  if (pagos.length === 0) return <div className="empty-state">📭 No hay pagos registrados</div>;

  return (
    <div className="cards-container">
      {pagos.map((p) => {
        const productosTexto = Array.isArray(p.productos) && p.productos.length > 0
          ? p.productos.map(prod => `${prod.nombre} x${prod.cantidad}`).join(', ')
          : 'Sin productos';
        
        return (
          <div key={p.id_confirmacion} className="pago-card">
            <div className="card-header">
              <div className="card-id">Pago #{p.id_confirmacion}</div>
              <div className="card-info-value">Pedido #{p.id_pedido}</div>
            </div>
            <div className="card-body">
              <div className="card-info">
                <div className="card-info-row">
                  <span className="card-info-label">👤 Usuario:</span>
                  <span className="card-info-value">{p.usuario}</span>
                </div>
                <div className="card-info-row">
                  <span className="card-info-label">🍽️ Productos:</span>
                  <span className="card-info-value" style={{ fontSize: '13px' }}>{productosTexto}</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button className="btn btn-ver" onClick={() => onVerComprobante(p.id_confirmacion)}>
                📄 Ver Comprobante
              </button>
              <button className="btn btn-pagar" onClick={() => onMarcarEntregado(p.id_pedido)}>
                ✅ Marcar Entregado
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TablaProductos = ({ productos, loading, onEditar, onEliminar }) => {
  if (loading) return <div className="loading">☕ Cargando productos...</div>;
  if (productos.length === 0) return <div className="empty-state">📭 No hay productos registrados</div>;

  return (
    <div className="cards-container">
      {productos.map((p) => (
        <div key={p.id} className="producto-card">
          <div className="card-header">
            <div className="card-id">{p.name}</div>
            <div className={`card-estado ${p.available === 'TRUE' ? 'estado-entregado' : 'estado-pendiente'}`}>
              {p.available === 'TRUE' ? '✅ Disponible' : '❌ No disponible'}
            </div>
          </div>
          <div className="card-body">
            <div className="card-info">
              <div className="card-info-row">
                <span className="card-info-label">🏷️ ID:</span>
                <span className="card-info-value">{p.id}</span>
              </div>
              <div className="card-info-row">
                <span className="card-info-label">📝 Descripción:</span>
                <span className="card-info-value">{p.description || '—'}</span>
              </div>
              <div className="card-info-row">
                <span className="card-info-label">🏪 Categoría:</span>
                <span className="card-info-value">{p.category}</span>
              </div>
              <div className="card-total">
                💰 ${p.price.toLocaleString('es-CO')}
              </div>
            </div>
          </div>
          <div className="card-actions">
            <button className="btn btn-editar" onClick={() => onEditar(p.id)}>✏️ Editar</button>
            <button className="btn btn-eliminar" onClick={() => onEliminar(p.id)}>🗑️ Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// =================== MODALES ===================
const ModalVerPedido = ({ modal, onClose }) => {
  if (!modal.open || !modal.data) return null;
  
  const pedido = modal.data;
  const productos = Array.isArray(pedido.productos) ? pedido.productos : [];

  return (
    <Modal isOpen={modal.open} onClose={onClose} title="Detalles del Pedido">
      <div className="detalle-pedido">
        <p><b>ID Pedido:</b> {pedido.id_pedido ?? 'N/A'}</p>
        <p><b>Usuario:</b> {pedido.usuario ?? 'Desconocido'}</p>
        <p><b>Correo:</b> {pedido.correo ?? '—'}</p>
        <p><b>Estado:</b> {pedido.estado ?? '—'}</p>
        <p><b>Fecha:</b> {pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleString() : '—'}</p>
        <p><b>Total:</b> ${pedido.total ? Number(pedido.total).toLocaleString('es-CO') : '0'}</p>
        <h3>🧾 Productos</h3>
        {productos.length > 0 ? (
          <ul>
            {productos.map((p, idx) => (
              <li key={idx}>
                {p.nombre || 'Producto sin nombre'} x{p.cantidad || 0} — ${p.subtotal ? Number(p.subtotal).toLocaleString('es-CO') : '0'}
              </li>
            ))}
          </ul>
        ) : (
          <p>❌ No hay productos asociados a este pedido.</p>
        )}
      </div>
    </Modal>
  );
};

const ModalEditarPedido = ({ modal, onClose, onGuardar }) => {
  const [estado, setEstado] = useState('pendiente');

  useEffect(() => {
    if (modal.data) {
      setEstado(modal.data.estado);
    }
  }, [modal.data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(modal.data.id, estado);
  };

  return (
    <Modal isOpen={modal.open} onClose={onClose} title="Editar Pedido">
      <form onSubmit={handleSubmit}>
        <label htmlFor="editarEstado">Estado:</label>
        <select id="editarEstado" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="pendiente">Pendiente</option>
          <option value="en preparacion">En preparación</option>
          <option value="entregado">Entregado</option>
        </select>
        <div className="modal-actions">
          <button type="submit" className="btn btn-editar">Guardar Cambios</button>
        </div>
      </form>
    </Modal>
  );
};

const ModalEliminarPedido = ({ modal, onClose, onEliminar }) => {
  return (
    <Modal isOpen={modal.open} onClose={onClose} title="Eliminar Pedido">
      <p>Eliminar el pedido #{modal.id}</p>
      <div className="modal-actions">
        <button className="btn btn-eliminar" onClick={onEliminar}>Eliminar Pedido</button>
      </div>
    </Modal>
  );
};

export default PanelAdmin;