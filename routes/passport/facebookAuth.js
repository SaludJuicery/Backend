// vendor library
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy;

exports.fbLoginPost = function (req, res, next) {

    console.log("Entered fbLoginPost");
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (req.user) {
        return res.send({ "Message": "You are already logged in!" });
    }
    
    console.log("No user found in session object. Fwding to passport.authenticate");
    //If not let passport handle the autentication
    //Once this method runs, passport first runs the passport.LocalStrategy method in app.js
    // That method's result(user object is fwded if auth is succesful) is forwarded to the call back functuion define here
	passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.facebook.com/v2.4/dialog/oauth',
    tokenURL: 'https://graph.facebook.com/oauth/access_token',
    clientID: process.env.facebook_app_ID, //uncomment and makesure this is set as env variable
    clientSecret: process.env.facebook_app_secret, //uncomment and makesure this is set as env variable
    callBackURL: ""
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("passport.use OAuth2Strategy invoked");
    console.log(profile);
    
    user = { 'username': profile.id, 'password': accessToken } 
    return done(null, user);
    }
  ));

    passport.authenticate('oauth2'), function (req, res) {
    // do something with req.user
    // if(err)
    // 	return res.send({"Message": err});

    req.user = user;
    return res.send({"Message": "Welcome "+user});
  	}
};