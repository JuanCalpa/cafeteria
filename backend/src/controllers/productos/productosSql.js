const connect = require('../../database/sqlConnection');

async function getProductos() {  
    const connection = await connect();
    const [rows] = await connection.execute('SELECT * FROM Productos');
    await connection.end(); 
    return rows;
}

async function getProductoById(id) {  
    const connection = await connect();
    const [rows] = await connection.execute('SELECT * FROM Productos WHERE id_producto = ?', [id]);
    await connection.end(); 
    return rows[0];
}

const createProducto = async (nombre, descripcion, precio, disponibilidad, categoria) => {
    const query = 'INSERT INTO Productos (nombre, descripcion, precio, disponibilidad, categoria) VALUES (?, ?, ?, ?, ?)';
    const connection = await connect();
    const [result] = await connection.execute(query, [nombre, descripcion, precio, disponibilidad, categoria]);
    await connection.end();
    return result;
}

async function updateProducto(id, nombre, descripcion, precio, disponibilidad, categoria) {
    const query = 'UPDATE Productos SET nombre = ?, descripcion = ?, precio = ?, disponibilidad = ?, categoria = ? WHERE id_producto = ?';
    const connection = await connect();
    const [result] = await connection.execute(query, [nombre, descripcion, precio, disponibilidad, categoria, id]);
    await connection.end();
    return result;
}

async function deleteProducto(id) {
    try{
        const connection = await connect();
        const [result] = await connection.execute('DELETE FROM Productos WHERE id_producto = ?', [id]);
        await connection.end();
        return result;
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        throw error;
    }
}

async function getCategorias() {
    const connection = await connect();
    const [rows] = await connection.execute('SELECT DISTINCT categoria FROM Productos ORDER BY categoria');
    await connection.end();
    return rows.map(r => r.categoria);
}


module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    getCategorias
};