const productosSql = require('./productosSql');

// Función auxiliar para obtener icono basado en categoría
function getIconForCategory(categoria) {
    const iconMap = {
        'ALMUERZOS': 'restaurant',
        'BEBIDAS': 'local_drink',
        'BEBIDAS PROPIAS': 'coffee',
        'COMIDA RÁPIDA': 'fastfood',
        'DESAYUNOS': 'breakfast_dining',
        'DULCES': 'cake',
        'HELADERIA': 'icecream',
        'SANDUCHES': 'lunch_dining',
        'PAPAS': 'fastfood',
        'LACTEOS': 'local_drink',
        'GASEOSAS': 'local_drink',
        'PAQUETES': 'shopping_bag',
        'PASTELERIA': 'cake',
        'REFRESCOS': 'local_drink',
        'VARIOS': 'category',
        'MEDICAMENTOS': 'medication'
    };
    return iconMap[categoria] || 'restaurant_menu';
}


function getColorForCategory(categoria) {
    const colorMap = {
        'ALMUERZOS': '#8D6E63',
        'BEBIDAS': '#6D4C41',
        'BEBIDAS PROPIAS': '#5D4037',
        'COMIDA RÁPIDA': '#8D6E63',
        'DESAYUNOS': '#6D4C41',
        'DULCES': '#5D4037',
        'HELADERIA': '#8D6E63',
        'SANDUCHES': '#6D4C41',
        'PAPAS': '#5D4037',
        'LACTEOS': '#8D6E63',
        'GASEOSAS': '#6D4C41',
        'PAQUETES': '#5D4037',
        'PASTELERIA': '#8D6E63',
        'REFRESCOS': '#6D4C41',
        'VARIOS': '#5D4037',
        'MEDICAMENTOS': '#D32F2F'
    };
    return colorMap[categoria] || '#8D6E63';
}

async function getProductos(req, res) {
    try {
        const productos = await productosSql.getProductos();
        
        const productosFormateados = productos.map(producto => ({
            id: producto.id_producto,
            name: producto.nombre,
            price: parseFloat(producto.precio.replace(/[$,]/g, '')) || 0,
            description: producto.descripcion,
            category: producto.categoria,
            available: producto.disponibilidad,
            icon: getIconForCategory(producto.categoria)
        }));
        res.json(productosFormateados);
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
        
        const categoriasFormateadas = categorias.map(cat => ({
            name: cat,
            icon: getIconForCategory(cat),
            color: getColorForCategory(cat)
        }));
        res.json(categoriasFormateadas);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getProductosByCategory(req, res) {
    try {
        const { categoryName } = req.params;
        const productos = await productosSql.getProductosByCategory(categoryName);
        // Transformar productos para compatibilidad con Flutter
        const productosFormateados = productos.map(producto => ({
            id: producto.id_producto,
            name: producto.nombre,
            price: parseFloat(producto.precio.replace(/[$,]/g, '')) || 0,
            description: producto.descripcion,
            category: producto.categoria,
            available: producto.disponibilidad,
            icon: getIconForCategory(producto.categoria)
        }));
        res.json(productosFormateados);
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function searchProductos(req, res) {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Falta el parámetro de búsqueda q' });
        }
        const productos = await productosSql.searchProductos(q);
        // Transformar productos para compatibilidad con Flutter
        const productosFormateados = productos.map(producto => ({
            id: producto.id_producto,
            name: producto.nombre,
            price: parseFloat(producto.precio.replace(/[$,]/g, '')) || 0,
            description: producto.descripcion,
            category: producto.categoria,
            available: producto.disponibilidad,
            icon: getIconForCategory(producto.categoria)
        }));
        res.json(productosFormateados);
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    getCategorias,
    getProductosByCategory,
    searchProductos
};
