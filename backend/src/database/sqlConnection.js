const mysql = require('mysql2/promise');

async function connect() {
  return await mysql.createConnection({
    host: "trolley.proxy.rlwy.net",
    port: 27281 ,
    user: "root",
    password: "edcvCYDlCsHcErofExvPvyNrCTojjNnG",
    database: "railway"
  });
}

module.exports = connect;