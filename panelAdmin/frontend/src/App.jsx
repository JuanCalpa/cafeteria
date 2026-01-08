import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import PanelCocina from './pages/PanelCocina';
import PanelAdmin from './pages/PanelAdmin';

// Componente para rutas protegidas
const ProtectedRoute = ({ children, rolesPermitidos }) => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}>
        Cargando...
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route 
          path="/panel" 
          element={
            <ProtectedRoute rolesPermitidos={['administrador']}>
              <PanelAdmin />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/cocina" 
          element={
            <ProtectedRoute rolesPermitidos={['cocina']}>
              <PanelCocina />
            </ProtectedRoute>
          } 
        />

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;