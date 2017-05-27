var User = require('../models/user');
var express = require('express');
//var app = express.app();
var multer = require('multer');
var mkdirp = require('mkdirp');


var _storage = multer.diskStorage({
	destination: function (req, file, cb) {
		mkdirp('public/uploads/ask/'+req.session.passport.user+'/');
 		cb(null, 'public/uploads/ask/'+req.session.passport.user);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now()+'@'+file.originalname);
	}
 })

var upload = multer({ storage: _storage });
//
// var multer_settings=multer({
//   dest:'./public/uploads/ask/'
// });



module.exports = function(app,passport){

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	

	// app.get('/', function(req, res, next) {
	// 	//console.log("trylogin");
	// 	//console.log(req.session);
	// 	res.render('index', { title: 'Roop Homepage', user : req.user,tryemail : req.session.tryemail, trypassword:req.session.trypassword, message:req.flash('loginMessage') });
	// });

	// app.get('/signin', function(req, res, next) {
	// 	res.render('signin', { title: 'Signin Page', message: req.flash('loginMessage') });
	// });

	// app.post('/signin', passport.authenticate('local-login', {
	// 	successRedirect : '/', // redirect to the secure profile section
	// 	failureRedirect : '/', // redirect back to the signup page if there is an error
	// 	failureFlash : true // allow flash messages
	// }));

	// app.get('/signup', function(req, res){
	// 	res.render('signup', { title: 'Signup Page', message: req.flash('signupMessage') });
	// });
	
	// app.post('/signup', passport.authenticate('local-signup', {
	// 	successRedirect : '/', // redirect to the secure profile section
	// 	failureRedirect : '/', // redirect back to the signup page if there is an error
	// 	failureFlash : true // allow flash messages
	// }));

	// app.post('/signup/checkemail',function(req,res){

	// 	console.log(req.body);
	// 	User.findOne({ 'local.email' :  req.body.data }, function(err, user) {
	// 		console.log(req.body);
	// 		if (user) {
	// 			console.log("here?");
	// 			res.send(true);
	// 		}
	// 		else{
	// 			res.send(false);

	// 		}
	// 	});
	// });

	// app.get('/logout', function(req, res) {
	// 	req.logout();
	// 	res.redirect('/');
	// });

	// app.get('/ask', ask.askpage);

	// app.get('/askForm', function(req, res, next) {
	// 	res.render('upload', { title: 'Ask Form Page', user : req.user  });
	// });

	// app.post('/askForm', upload.single('userfile'), ask.askenroll);

	// app.get('/askUploaded', function(req, res, next) {
	// 	res.render('askUploaded', { title: 'Ask Uploaded Page', user : req.user  });
	// });

	// app.get('/upload', function(req, res, next) {
	// 	res.render('upload',{user:req.user});
	// });

	// app.post('/upload', upload.single('userfile'), ask.askenroll);

	// app.post('/addToMyCoupon', ask.addtomycoupon);

	// app.get('/answer', answer.answerPage);
	


};

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
