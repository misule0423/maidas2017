var configAuth = require('../config/auth');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');


module.exports = function(passport){

  passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user.id);
  });

// used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  passport.use('local-signup', new LocalStrategy({
          // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    firstNameField : 'firstName',
    lastNameField : 'lastName',
    yearField : 'year',
    monthField : 'month',
    dayField : 'day',
    genderField : 'gender',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, firstName, lastName, year, month, day, gender, done) {
    process.nextTick(function() {

      User.findOne({ 'local.email' :  email }, function(err, user) {
              // if there are any errors, return the error
        if (err)
          return done(err);

              // check to see if theres already a user with that email
        if (user) {
          return done(null, false, false, false, false, false, false, false, false, req.flash('signupMessage', 'That email is already taken.'));
        }
        else {
          var newUser            = new User();
          newUser.local.email     = email;
          newUser.local.password  = newUser.generateHash(password);
          newUser.local.name      = lastName+firstName;
          newUser.birth           = day+'/'+month+'/'+year;
          newUser.gender          = gender;
          newUser.cash            = 0;
          newUser.time            = Date.now();

          newUser.save(function(err){
            if (err)
              throw err;
            return done(null, newUser);

          });

        }
      });

    });

  }));


  passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        firstNameField : 'firstName',
        lastNameField : 'lastName',
        yearField : 'year',
        monthField : 'month',
        dayField : 'day',
        genderField : 'gender',
        passReqToCallback : true // allows us to pass back the entire request to the callback
       },
    function(req, email, password, firstName, lastName, year, month, day, gender, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user){
                req.session.tryemail=email;
                return done(null, false, req.flash('loginMessage', 'wrongid')); // req.flash is the way to set flashdata using connect-flash
            }
            // if the user is found but the password is wrong
            if (!user.validPassword(password)){
                  req.session.tryemail=email;
                  req.session.trypassword=password;
                return done(null, false, req.flash('loginMessage', 'wrongpassword')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            return done(null, user);
        });

    }));



  var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  };


  passport.use(new FacebookStrategy({
       // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    profileFields   : ["id","name","gender","birthday","emails", "displayName"]

  },

   // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {
    //console.log(profile);
       // asynchronous
    process.nextTick(function() {
           // find the user in the database based on their facebook id
      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
               //    console.log(user);
               // if there is an error, stop everything and return that
               // ie an error connecting to the database
        if (err)
          return done(err);
               // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        }
        else {
                   // if there is no user found with that facebook id, create them
          var newUser            = new User();

                   // set all of the facebook information in our user model
          newUser.facebook.id    = profile.id; // set the users facebook id
          newUser.facebook.token = token; // we will save the token that facebook provides to the user
          newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
          newUser.facebook.name  = profile.displayName;
          if(profile.birthday)
            newUser.birth        = profile.birthday;
          newUser.cash           = 0;
          if(profile.gender)
            newUser.gender       = profile.gender;
          newUser.time           = Date.now();

                   // save our user to the database
          newUser.save(function(err) {
            if (err)
              throw err;
                       // if successful, return the new user
            return done(null, newUser);
          });
        };

      });
    });
   }));

};
