const connect = require('../../database/sqlConnection');

async function getProductos() {  
    const connection = await connect();
    const [rows] = await connection.execute('SELECT * FROM Productos');
    await connection.end(); 
    return rows;
}

module.exports = { 
    getProductos
 };