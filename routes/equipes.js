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
	var listEquipe = [];
	var j = 0;
	var selectQuery = 'SELECT * FROM EQUIPE';
    var cnx = pool.getConnection(function(err, cnx){
		var sqlQuery = cnx.query(selectQuery);
		sqlQuery.on("result", function(row) {
			listEquipe[j] = {nomEquipe : row.nomEquipe, idEquipe : row.idEquipe};
			j++;
		});
		sqlQuery.on("end", function() {
		  cnx.destroy();
		  res.json(listEquipe);
		});
		sqlQuery.on("error", function(error) {
			console.log(error);
		});
	});
});

/* PUT /participants/:id */
router.put('/:id', function(req, res, next) {
	var selectQuery = 'UPDATE EQUIPE set ? WHERE idEquipe = '+req.params.id;
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
	 res.json(post);
});

/* GET /participants/:nomEquipe */
router.get('/:nomEquipe', function(req, res, next) {
	var idEquipe = null;
	var selectQuery = 'SELECT * FROM EQUIPE WHERE nomEquipe = "'+req.params.nomEquipe+'"';
    var cnx = pool.getConnection(function(err, cnx){
		var sqlQuery = cnx.query(selectQuery);
		sqlQuery.on("result", function(row) {
			idEquipe = row.idEquipe;
		});
		sqlQuery.on("end", function() {
		  cnx.destroy();
		  res.json(idEquipe);
		});
		sqlQuery.on("error", function(error) {
			console.log(error);
		});
	});
});

module.exports = router;
