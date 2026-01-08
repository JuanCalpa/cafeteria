import { useState, useEffect } from 'react';
import { productosAPI } from '../services/api';
import Modal from './Modal';

const ModalEditarProducto = ({ modal, onClose, onSuccess }) => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    disponibilidad: 'TRUE',
    categoria: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modal.open) {
      cargarCategorias();
      if (modal.data) {
        setFormData({
          nombre: modal.data.nombre || '',
          descripcion: modal.data.descripcion || '',
          precio: modal.data.precio || '',
          disponibilidad: modal.data.disponibilidad || 'TRUE',
          categoria: modal.data.categoria || ''
        });
      }
    }
  }, [modal.open, modal.data]);

  const cargarCategorias = async () => {
    try {
      const data = await productosAPI.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await productosAPI.actualizar(modal.data.id_producto, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal.open} onClose={onClose} title="Editar Producto">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="editarCategoria">Categoría:</label>
            <select
              id="editarCategoria"
              value={formData.categoria}
              onChange={(e) => handleChange('categoria', e.target.value)}
              required
            >
              <option value="">Selecciona categoría</option>
              {categorias.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="editarNombre">Nombre:</label>
            <input
              type="text"
              id="editarNombre"
              placeholder="Ej: Café"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="editarDescripcion">Descripción:</label>
            <input
              type="text"
              id="editarDescripcion"
              placeholder="Ej: Café negro"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="editarPrecio">Precio:</label>
            <input
              type="text"
              id="editarPrecio"
              placeholder="Ej: $2,500"
              value={formData.precio}
              onChange={(e) => handleChange('precio', e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="editarDisponibilidad">Disponibilidad:</label>
            <select
              id="editarDisponibilidad"
              value={formData.disponibilidad}
              onChange={(e) => handleChange('disponibilidad', e.target.value)}
              required
            >
              <option value="TRUE">Disponible</option>
              <option value="FALSE">No disponible</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button type="submit" className="btn btn-editar" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalEditarProducto;