var http = require('http');
var url = require('url');
var express = require('express')
  ,	stylus = require('stylus')
  ,	nib = require('nib');
var app = express();
var jf = require('jsonfile');
var fs = require('fs');
var bodyParser = require('body-parser');
var cp = require('child_process');
var mysql = require('mysql');
var listEquipe = [];

var pool = mysql.createPool({
  host     : "localhost",
  user     : "root",
  password : "",
  database : "tournoi_foot"
});

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + './public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))


app.get('/', function (req, res) {
	
  res.render('test',
  { title : 'Tournoi de Foot' }
  )
})

app.get('/inscriptionInd', function (req, res) {
  var selectQuery = 'SELECT * FROM equipe';
  var cnx = pool.getConnection(function(err, cnx){
	var sqlQuery = cnx.query(selectQuery);
	var i = 0;
	sqlQuery.on("result", function(row) {
		listEquipe[i] = {name : row.NOMEQUIPE};
		i++;
	});
	sqlQuery.on("end", function() {
		 cnx.destroy();
		 res.render('inscription',
			 { title : 'Tournoi de Foot' , equipes : listEquipe, joueurs : ''}
		 )
	});
	sqlQuery.on("error", function(error) {
		console.log(error);
	});
  })
  
 
  
  
})

app.get('/contact', function (req, res) {
	
  res.render('enconstruction',{})
})

app.post('/clickTeam', function (req, res) {
	var selectTeam = req.body.team;
	var lastName = req.body.nom;
	var firstName = req.body.prenom;
	var dateNaiss = req.body.datenaiss;
	var listJoueur = [];
	var j = 0;
	
	var cnx = pool.getConnection(function(err, cnx){
		var sqlQuery2 = cnx.query("SELECT participants.* FROM participants, equipe WHERE participants.IDEQUIPE = equipe.IDEQUIPE AND equipe.NOMEQUIPE = '"+selectTeam+"' ");
		sqlQuery2.on("result", function(row) {
			listJoueur[j] = {nom : row.NOMPARTICIPANT, prenom : row.PRENOMPARTICIPANT, datenaiss : row.DATENAISS};
			console.log(listJoueur[j].nom);
			console.log(selectTeam);
			j++;
		});
		sqlQuery2.on("end", function() {
			 cnx.destroy();
			 res.render('inscription',
				 { title : 'Tournoi de Foot' , equipes : listEquipe, joueurs : listJoueur, selectTeam : selectTeam, lastName : lastName, firstName : firstName, dateNaiss : dateNaiss }
			 )
		});
	})
})

app.get('/inscripvalid', function (req, res) {
	
  res.render('enconstruction',{})
})
		
app.get('/foot_controller', function(req, res){
  res.render('foot_accueil',
  { title : 'Tournoi de Foot' }
  )
});
app.listen(8000);