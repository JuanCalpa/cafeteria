const mysql = require('mysql2/promise');

async function connect() {
  return await mysql.createConnection({
    host: "turntable.proxy.rlwy.net",
    port: 40946,
    user: "root",
    password: "WvbFnAMNeMEoDYPzChTewVZoLAgfcqvG",
    database: "railway"
  });
}

module.exports = connect;