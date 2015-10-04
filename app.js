var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var OAuth2Strategy = require('passport-oauth2').Strategy;
//var FacebookTokenStrategy = require('passport-facebook-token').Strategy;

var app = express();

//Add custom things here
var routes = require('./routes');
var Model = require('./models/model');
var logout = require('./routes/passport/logout.js');
var passportLocal = require('./routes/passport/passportLocal.js');
var facebookAuth = require('./routes/passport/facebookAuth.js');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'saludyahoo!',
    //store: sessionStore, // connect-mongo session store
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function (username, password, done) {
    new Model.DBUser({ username: username }).fetch().then(function (data) {
        var user = data;
        console.log("The user name form post request is " + username);
        console.log("The password got form post request is " + password);
        if (user === null) {
            console.log("In passport.use, user object is null");
            return done(null, false, { message: 'Invalid username or password' });
        } else {
            user = { 'username': data.attributes.username, 'password': data.attributes.password };
            if (password !== user.password) {
                console.log("Passwords are not same");
                return done(null, false, { message: 'Incorrect password' });
            } else {
                console.log(password + " == " + user.password)
                return done(null, user);
            }
        }
    });
}));

// passport.use(new FacebookTokenStrategy({
//     clientID: 900851463322720,
//     clientSecret: 'asdasdadasdad',
//     authorizationURL: 'https://www.facebook.com/v2.4/dialog/oauth'
//   },
//   function(accessToken, refreshToken, profile, done) {
//     //need to do some checking here - check if profile contains data => token is valid
//     console.log(profile);

//     //is something is wrong you have to return done(null, false);


//     //now that he is authenticated with facebook, i just wanna send the details forward
//     //now this is a bad thing...i mean any on who can create a valid fb token can use the system if its a valid token
//     //=> things can be faked...bt finally he has to pay with his credit card so....it shoudnt matter to us
//     //or we can change this way...provide an interface for vigneswarr to first inset that fb id into db
//     //here i ill chek if the user exists...if so...ill forward the detials
//     user = { 'username': profile.id, 'password': accessToken};
//     return done(null, user);

//     // User.findOrCreate({ username: profile.id }, function (err, user) {
//     //   return done(err, user);
//     // });
//   }
// ));

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.facebook.com/v2.4/dialog/oauth',
    tokenURL: 'https://graph.facebook.com/oauth/access_token',
    clientID: '1467907626851148',
    clientSecret: '2160965bae73bc37c805f6cd2e0fab7e'
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log("passport.use OAuth2Strategy invoked");
  	console.log(profile);
  	
    user = { 'username': profile.id, 'password': accessToken } 
    return done(null, user);
  	}
  ));


app.use('/', routes);
app.post('/dbLogin', passportLocal.dbLoginPost);
app.post('/facebookAuth', facebookAuth.fbLoginPost);
app.post('/logout', logout.logout);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});