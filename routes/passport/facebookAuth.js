// vendor library
var passport = require('passport');

// custom library
// model
var Model = require('../../models/model');

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
	passport.authenticate('passport-oauth2'), function (err, user) {
    // do something with req.user
    if(err)
    	return res.send({"Message": err});

    req.user = user;
    return res.send({"Message": "Welcome "+user.username});
  	}
};