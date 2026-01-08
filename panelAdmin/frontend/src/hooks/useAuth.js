import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    try {
      const data = await authAPI.verificarSesion();
      setUsuario(data.usuario);
    } catch (error) {
      console.log('No hay sesión activa');
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (correo, contrasena) => {
    try {
      const data = await authAPI.login(correo, contrasena);
      setUsuario(data.usuario);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error en el login' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUsuario(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al cerrar sesión' };
    }
  };

  return {
    usuario,
    loading,
    login,
    logout,
    isAuthenticated: !!usuario
  };
};