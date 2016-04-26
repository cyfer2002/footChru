var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
  host     : "localhost",
  user     : "glassapp",
  password : "Cd1aggIc",
  database : "tournoi_foot"
});


/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

/* PUT /participants/:id */
router.put('/:id', function(req, res, next) {
	var selectQuery = 'UPDATE PARTICIPANTS set ? WHERE idParticipants = '+req.params.id;
    var cnx = pool.getConnection(function(err, cnx){
		var sqlQuery = cnx.query(selectQuery, req.body);
		sqlQuery.on("result", function(row) {
		});
		sqlQuery.on("end", function() {
		  cnx.destroy();
		  res.send({success : true});
		});
		sqlQuery.on("error", function(error) {
			console.log(error);
		});
	});
});

/* DELETE /participants/:id */
router.delete('/:id', function(req, res, next) {
	var selectQuery = 'DELETE FROM PARTICIPANTS WHERE idParticipants = '+req.params.id;
    var cnx = pool.getConnection(function(err, cnx){
		var sqlQuery = cnx.query(selectQuery);
		sqlQuery.on("result", function(row) {
		});
		sqlQuery.on("end", function() {
		  cnx.destroy();
		  res.send({success : true});
		});
		sqlQuery.on("error", function(error) {
			console.log(error);
		});
	});
});

/* GET /participants/:id */
router.get('/:id', function(req, res, next) {

    res.json(post);

});

/* GET /participants/list */
router.get('/list', function(req, res, next) {

    res.json(post);

});
module.exports = router;
