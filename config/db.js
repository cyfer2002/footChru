var sql = require('mysql');


var pool = mysql.createPool({
  host     : "localhost",
  user     : "glassapp",
  password : "Cd1aggIc",
  database : "tournoi_foot"
});

var DB = sql.connect(config, function(err) {

  if (err){
	 throw err ;
  } else{


	 console.log('connected');
  }

});


/*--------------------Connection--------------------------------*/

module.exports.DB = DB;