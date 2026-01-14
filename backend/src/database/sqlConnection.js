const mysql = require('mysql2/promise');

async function connect() {
  return await mysql.createConnection({
    host: "tramway.proxy.rlwy.net",
    port: 40068 ,
    user: "root",
    password: "AHqRqlXwHWnCZSgOafguqTqvNbmiwEhJ",
    database: "railway",
    connectTimeout: 60000, // 60 segundos
    acquireTimeout: 60000,
    timeout: 60000
  });
}

module.exports = connect;