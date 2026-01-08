import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { pedidosAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';
import '../assets/panel.css';

const PanelCocina = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const data = await pedidosAPI.getPedidosCocina();
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  const sidebarItems = [
    { id: 'cocina', label: 'Panel Cocina', onClick: () => {} }
  ];

  return (
    <div className="panel-layout">
      <Sidebar 
        items={sidebarItems} 
        onLogout={() => setShowLogoutConfirm(true)} 
      />
      
      <div className="main-content">
        <div className="panel-header">
          <h1>🍳 Panel de Cocina</h1>
        </div>

        <div className="tabla-container">
          {loading ? (
            <div className="loading">☕ Cargando pedidos...</div>
          ) : pedidos.length === 0 ? (
            <div className="empty-state">📭 No hay pedidos registrados</div>
          ) : (
            <div className="cards-container">
              {pedidos.map((pedido) => (
                <div key={pedido.id_pedido} className="pedido-card">
                  <div className="card-header">
                    <div className="card-id">Pedido #{pedido.id_pedido}</div>
                    <div className="card-estado estado-en-preparacion">
                      🍳 En Cocina
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-info">
                      <div className="card-info-row">
                        <span className="card-info-label">👤 Cliente:</span>
                        <span className="card-info-value">{pedido.usuario}</span>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <span className="card-info-label" style={{ display: 'block', marginBottom: '8px' }}>
                          🍽️ Productos y Especificaciones:
                        </span>
                        <div style={{ 
                          background: '#fef5e7', 
                          padding: '12px', 
                          borderRadius: '8px',
                          borderLeft: '4px solid #8d6e63',
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}>
                          {pedido.productos_especificaciones}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="⚠️ Cerrar Sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmText="Sí, Cerrar Sesión"
      />
    </div>
  );
};

export default PanelCocina;