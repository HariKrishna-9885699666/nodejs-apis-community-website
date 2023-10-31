const mysql = require("mysql2");
const dbConfig = require("./config/config")[process.env.NODE_ENV];

// Create a connection to the database
let connection;
function handleDisconnect() {
  connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock', //add this for mysql local instance
  });

  connection.connect(function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("Successfully connected to the mysql database.");
    }
  });

  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;
