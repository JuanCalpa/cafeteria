const productosSql = require('./productosSql');

async function getProductos(req, res) {
    try {
        const productos = await productosSql.getProductos();
        res.json(productos);
    } catch (error) {
        console.error('Error al listar products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getProductoById(req, res) {
    try {
        const { id_producto } = req.query;
        if (!id_producto) {
            return res.status(400).json({ error: 'Falta el id del producto' });
        }
        const producto = await productosSql.getProductoById(id_producto);
        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function createProducto(req, res) {
    const { nombre, descripcion, precio, disponibilidad, categoria } = req.body;
    try {
        const resultado = await productosSql.createProducto(nombre, descripcion, precio, disponibilidad, categoria);
        res.status(201).json({ message: 'Producto creado', id: resultado.insertId });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function updateProducto(req, res) {
    try {
        const { id_producto } = req.params;
        const { nombre, descripcion, precio, disponibilidad, categoria } = req.body;
        const resultado = await productosSql.updateProducto(id_producto, nombre, descripcion, precio, disponibilidad, categoria);
        res.status(200).json({ message: 'Producto actualizado', affectedRows: resultado.affectedRows });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

async function deleteProducto(req, res) {
    try {
        const { id_producto } = req.params;
        const resultado = await productosSql.deleteProducto(id_producto);
        res.status(200).json({ message: 'Producto eliminado', affectedRows: resultado.affectedRows });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getCategorias(req, res) {
    try {
        const categorias = await productosSql.getCategorias();
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    getCategorias
};
