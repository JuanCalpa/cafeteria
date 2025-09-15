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

module.exports = {
    getProductos
};