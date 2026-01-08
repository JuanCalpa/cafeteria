import { useState, useEffect } from 'react';
import { productosAPI } from '../services/api';
import Modal from './Modal';

const ModalCrearProducto = ({ isOpen, onClose, onSuccess }) => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([
    {
      nombre: '',
      descripcion: '',
      precio: '',
      disponibilidad: 'TRUE',
      categoria: ''
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarCategorias();
    }
  }, [isOpen]);

  const cargarCategorias = async () => {
    try {
      const data = await productosAPI.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const agregarOtroProducto = () => {
    setProductos([
      ...productos,
      {
        nombre: '',
        descripcion: '',
        precio: '',
        disponibilidad: 'TRUE',
        categoria: ''
      }
    ]);
  };

  const removerProducto = (index) => {
    if (productos.length > 1) {
      setProductos(productos.filter((_, i) => i !== index));
    }
  };

  const actualizarProducto = (index, field, value) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][field] = value;
    setProductos(nuevosProductos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que al menos un producto tenga datos completos
    const productosValidos = productos.filter(
      p => p.categoria && p.nombre && p.precio
    );

    if (productosValidos.length === 0) {
      alert('Agrega al menos un producto válido.');
      return;
    }

    setLoading(true);
    try {
      // Crear todos los productos
      for (const prod of productosValidos) {
        await productosAPI.crear(prod);
      }

      // Resetear formulario
      setProductos([
        {
          nombre: '',
          descripcion: '',
          precio: '',
          disponibilidad: 'TRUE',
          categoria: ''
        }
      ]);

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al crear productos:', error);
      alert('Error al crear los productos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar Producto">
      <form onSubmit={handleSubmit}>
        <div id="productosContainer">
          {productos.map((producto, index) => (
            <div key={index} className="producto-item">
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Categoría:</label>
                  <select
                    value={producto.categoria}
                    onChange={(e) => actualizarProducto(index, 'categoria', e.target.value)}
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
                  <label>Nombre:</label>
                  <input
                    type="text"
                    placeholder="Ej: Café"
                    value={producto.nombre}
                    onChange={(e) => actualizarProducto(index, 'nombre', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Descripción:</label>
                  <input
                    type="text"
                    placeholder="Ej: Café negro"
                    value={producto.descripcion}
                    onChange={(e) => actualizarProducto(index, 'descripcion', e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Precio:</label>
                  <input
                    type="text"
                    placeholder="Ej: $2,500"
                    value={producto.precio}
                    onChange={(e) => actualizarProducto(index, 'precio', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label>Disponibilidad:</label>
                  <select
                    value={producto.disponibilidad}
                    onChange={(e) => actualizarProducto(index, 'disponibilidad', e.target.value)}
                    required
                  >
                    <option value="TRUE">Disponible</option>
                    <option value="FALSE">No disponible</option>
                  </select>
                </div>
                {productos.length > 1 && (
                  <div style={{ flex: 1 }}>
                    <button
                      type="button"
                      className="btn btn-eliminar"
                      onClick={() => removerProducto(index)}
                    >
                      ❌ Remover
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-nuevo"
          onClick={agregarOtroProducto}
          style={{ marginTop: '10px', width: '100%' }}
        >
          ➕ Agregar Otro Producto
        </button>

        <div className="modal-actions">
          <button type="submit" className="btn btn-nuevo" disabled={loading}>
            {loading ? 'Creando...' : 'Agregar Productos'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalCrearProducto;