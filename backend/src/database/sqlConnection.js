const mysql = require('mysql2/promise');

async function connect() {
  return await mysql.createConnection({
    host: "containers-us-west-85.railway.app",
    port: 37484,
    user: "root",
    password: "lLivqufeGdOuXLwfLjemfBOPpKlTcGiS",
    database: "railway"
  });
}

module.exports = connect;