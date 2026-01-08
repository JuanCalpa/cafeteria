import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// =================== AUTENTICACIÓN ===================
export const authAPI = {
  login: async (correo, contrasena) => {
    const response = await api.post('/login', { correo, contrasena });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  
  verificarSesion: async () => {
    const response = await api.get('/verificarSesion');
    return response.data;
  },
  
  registro: async (datos) => {
    const response = await api.post('/registro', datos);
    return response.data;
  }
};

// =================== PEDIDOS ===================
export const pedidosAPI = {
  getAll: async () => {
    const response = await api.get('/pedidosPanel');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/pedidosPanel/${id}`);
    return response.data;
  },
  
  actualizar: async (id_pedido, estado) => {
    const response = await api.put('/actualizarPedido', { id_pedido, estado });
    return response.data;
  },
  
  cancelar: async (id_pedido) => {
    const response = await api.post('/cancelarPedido', { id_pedido });
    return response.data;
  },
  
  crearManual: async (datos) => {
    const response = await api.post('/crearPedidoManual', datos);
    return response.data;
  },
  
  getPedidosCocina: async () => {
    const response = await api.get('/pedidosCocina');
    return response.data;
  }
};

// =================== PRODUCTOS ===================
export const productosAPI = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/productoById?id_producto=${id}`);
    return response.data;
  },
  
  crear: async (producto) => {
    const response = await api.post('/createProducto', producto);
    return response.data;
  },
  
  actualizar: async (id, producto) => {
    const response = await api.put(`/updateProducto/${id}`, producto);
    return response.data;
  },
  
  eliminar: async (id) => {
    const response = await api.delete(`/deleteProducto/${id}`);
    return response.data;
  },
  
  getCategorias: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  buscar: async (query) => {
    const response = await api.get(`/products/search?q=${query}`);
    return response.data;
  }
};

// =================== PAGOS ===================
export const pagosAPI = {
  getAll: async () => {
    const response = await api.get('/pagosPanel');
    return response.data;
  },
  
  getComprobante: async (id_confirmacion) => {
    // Retorna la URL directamente para abrir en nueva pestaña
    return `/api/getComprobanteFile/${id_confirmacion}`;
  }
};

export default api;