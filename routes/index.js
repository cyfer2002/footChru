var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var passport = require('passport');
var fs = require('fs');
var multer = require('multer');
var bcrypt = require('bcrypt-nodejs');

var title = 'Inscription';
var upload = multer({dest: './public/images/identite'});

router.use(passport.initialize());
router.use(passport.session());



var pool = mysql.createPool({
  host     : "localhost",
  user     : "glassapp",
  password : "Cd1aggIc",
  database : "tournoi_foot"
});



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('test',
		{ title : title , user : req.user}
	);
});

/* Init Mdp Admin */
router.get('/initMDP', function(req, res, mext) {
	var hash = bcrypt.hashSync("nico");
	var user = { username : 'nico', password : hash}
	var selectQuery = 'UPDATE USER set ?';
    var cnx = pool.getConnection(function(err, cnx){
		var sqlQuery = cnx.query(selectQuery, user);
		sqlQuery.on("result", function(row) {
		});
		sqlQuery.on("end", function() {
		  cnx.destroy();
		});
		sqlQuery.on("error", function(error) {
			console.log(error);
		});
	});
});

/* POST Login verification. */
router.post('/login',
  passport.authenticate('local', {
	    successRedirect : '/',
		failureRedirect: '/loginFailure',
		failureFlash: true
		}));

/* POST LogOut page. */
router.get('/logOut', function (req, res, next) {
	req.logout();
	res.redirect('/');
});

router.get('/signIn', function (req, res, next) {
	res.render('signIn');
});

/* POST Login Failure. */
router.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

/* POST Login Sucess. */
router.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

/* GET Contact page. */
router.get('/contact', function (req, res) {
  res.render('contact',{user : req.user, title : title})
})

/* GET Inscription page. */
router.get('/listInscrit', function (req, res) {
	if (req.isAuthenticated()) {
		var listEquipe = [];
		var joueurs = [];
		var selectQuery2 = 'SELECT * FROM participants ORDER BY nomParticipants';
		var selectQuery = 'SELECT * FROM equipe';
		var cnx = pool.getConnection(function(err, cnx){
			var sqlQuery = cnx.query(selectQuery);
			sqlQuery.on("result", function(row) {
				listEquipe[row.idEquipe] = {name : row.nomEquipe};
			});
			sqlQuery.on("end", function() {
				var sqlQuery2 = cnx.query(selectQuery2);
				var i = 0;
				sqlQuery2.on("result", function(row) {
					joueurs[i] = {idParticipants : row.idParticipants, nomParticipants : row.nomParticipants, prenomParticipants : row.prenomParticipants, dateNaiss : row.dateNaiss, nomEquipe : listEquipe[row.idEquipe].name}
					i++
				});
				sqlQuery2.on("end", function() {
					cnx.destroy();
					res.render('listInscrit', {participants : joueurs, title : title, user : req.user})
				});
				sqlQuery2.on("error", function(error) {
					console.log(error);
				});
			});
			sqlQuery.on("error", function(error) {
				console.log(error);
			});
		})
	}
	else res.redirect('/signIn', {})
})

/* GET Inscription page. */
router.get('/inscriptionInd', function (req, res) {
  var listEquipe = [];
  var selectQuery = 'SELECT * FROM equipe ORDER BY nomEquipe';
  var cnx = pool.getConnection(function(err, cnx){
	var sqlQuery = cnx.query(selectQuery);
	var i = 0;
	sqlQuery.on("result", function(row) {
		listEquipe[i] = {name : row.nomEquipe};
		i++;
	});
	sqlQuery.on("end", function() {
		 cnx.destroy();
		 res.render('inscription',
			 { user : req.user, title : title , equipes : listEquipe, joueurs : ''}
		 )
	});
	sqlQuery.on("error", function(error) {
		console.log(error);
	});
  })
})

/* POST Validation des inscriptions page. */
router.post('/validInscrip', upload.single('displayImage'), function (req, res) {
	
	console.log('files :' + req.file.filename);
	var listEquipe = [];
	var id;
	var cnx = pool.getConnection(function(err, cnx){
		var selectTeam = { nomEquipe : req.body.team};
		var sqlQuery = cnx.query("SELECT idEquipe FROM equipe WHERE ?", selectTeam);
		sqlQuery.on("result", function(row) {
			id = row.idEquipe;
		});
		sqlQuery.on("end", function() {
			var valeur = { nomParticipants : req.body.nom, prenomParticipants : req.body.prenom, dateNaiss : req.body.dateNaiss, idEquipe : id, lienPhoto : req.file.filename};
			selectQuery = 'INSERT INTO participants SET ?'
			sqlQuery2 = cnx.query(selectQuery, valeur);
			sqlQuery2.on("result", function(row) {
			
			});
			sqlQuery2.on("end", function() {
				cnx.destroy();
				res.render('inscription',
					{ user : req.user, title : title , equipes : listEquipe, joueurs : ''}
				)
			});
			sqlQuery2.on("error", function(error) {
				console.log(error);
			});
		});
		sqlQuery.on("error", function(error) {
			console.log(error);
		});
	})
})

/* POST AjouEquipe page. */
router.post('/ajoutEquipe', function (req, res) {
	var listEquipe = [];
	var selectTeam = { nomEquipe : req.body.equipeName , nbMaxEquipe : req.body.max};
	var selectQuery = "INSERT INTO equipe SET ?"
	var cnx = pool.getConnection(function(err, cnx){
		var sqlQuery = cnx.query(selectQuery, selectTeam);
		sqlQuery.on("result", function(row) {
		});
		sqlQuery.on("end", function() {
			var selectQuery2 = "SELECT * FROM equipe";
			var sqlQuery2 = cnx.query(selectQuery2);
			var i = 0;
			sqlQuery2.on("result", function(row){
				listEquipe[i] = {name : row.nomEquipe};
				i++;
			});
			sqlQuery2.on("end", function(){
				cnx.destroy();
				res.render('inscription',
				 { user : req.user, title : title , equipes : listEquipe, joueurs : ''}
			 )
			});
			sqlQuery2.on("error", function(error){
				console.log(error);
			});			 
		});
		sqlQuery.on("error", function(error) {
			console.log(error);
		});
	})
})

/* POST ClickTeam page. */
router.post('/clickTeam', function (req, res) {
	var selectTeam = req.body.team;
	var listJoueur = [];
	var j = 0;
	
	var cnx = pool.getConnection(function(err, cnx){
		var sqlQuery2 = cnx.query("SELECT participants.* FROM participants, equipe WHERE participants.idEquipe = equipe.idEquipe AND equipe.nomEquipe = '"+selectTeam+"' ");
		sqlQuery2.on("result", function(row) {
			listJoueur[j] = {nom : row.nomParticipants, prenom : row.prenomParticipants, datenaiss : row.dateNaiss};
			j++;
		});
		sqlQuery2.on("end", function() {
			 cnx.destroy();
			 var toSend;
			 toSend = '<h4 align=center> Liste des joueurs : ' + selectTeam +
						'<p><h5 align=center>' +
						'';
			for (var i = 0; i < listJoueur.length ; i++){
				toSend = toSend + '' + listJoueur[i].nom + ' - ' + listJoueur[i].prenom + '<br>';
			}
			toSend = toSend + 
						'' +
						'</h5></p>' +
						'</h4>';
			res.send(toSend);
		});
	})
})

/* GET ListJoueur page. */
router.get('/listJoueur', function (req, res) {
	if (req.isAuthenticated()) {
		var joueurs = [];
		var j = 0;
		var selectQuery = 'SELECT * FROM participants ORDER BY nomParticipants';
		var cnx = pool.getConnection(function(err, cnx){
			var sqlQuery = cnx.query(selectQuery);
			sqlQuery.on("result", function(row) {
				joueurs[j] = row;
				j++;
			});
			sqlQuery.on("end", function() {
				cnx.destroy();
				res.render('listJoueur', {participants : joueurs, title : title, user : req.user});
			});
			sqlQuery.on("error", function(error) {
				console.log(error);
			});
		})
	}
	else res.redirect('/signIn', {})
})
module.exports = router;
