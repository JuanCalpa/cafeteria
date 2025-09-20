const mysql = require('mysql2/promise');

async function connect() {
  return await mysql.createConnection({
    host: "nozomi.proxy.rlwy.net",
    port: 41819,
    user: "root",
    password: "GfvfEUHFTOzUGbimZbkDaersFVsWommf",
    database: "Cafeteria"
  });
}

module.exports = connect;