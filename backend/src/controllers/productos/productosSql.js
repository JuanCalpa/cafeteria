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

const createProducto = async (nombre, descripcion, precio, stock, categoria) => {
    const query = 'INSERT INTO Productos (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)';
    const connection = await connect(); 
    const [result] = await connection.execute(query, [nombre, descripcion, precio, stock, categoria]);
    await connection.end();
    return result;
}

async function updateProducto(id, nombre, descripcion, precio, stock, categoria) {  
    const query = 'UPDATE Productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ? WHERE id_producto = ?';
    const connection = await connect();
    const [result] = await connection.execute(query, [nombre, descripcion, precio, stock, categoria, id]);
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


module.exports = { 
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
 };