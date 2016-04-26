var mysql = require('mysql');

var pool = mysql.createPool({
  host     : "localhost",
  user     : "glassapp",
  password : "Cd1aggIc",
  database : "tournoi_foot"
});

module.exports = mysql.model('accounts', Account);