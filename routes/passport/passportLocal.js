// vendor library
var passport = require('passport');
//var bcrypt = require('bcryptjs');

// custom library
// model
//var Model = require('../../models/model');

exports.dbLoginPost = function (req, res, next) {
    
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (req.user) {
        return res.send({ "Message": "You are already logged in!" });
    }
    
    //If not let passport handle the autentication
    //Once this method runs, passport first runs the passport.LocalStrategy method in app.js
    // That method's result(user object is fwded if auth is succesful) is forwarded to the call back functuion define here
	passport.authenticate('local', {} ,function (err, user, info) {
		if (err) {
			return res.send({'Message': err.message}, {'request':req});
		}
		if (!user) {
			console.log("In exports.dbLoginPost, user object is null");
			return res.send({'Message': 'Username password combination incorrect'});
		}
		return req.logIn(user, function (err) {
			if (err) {
				return res.send({'Message': err.message});
			} else {
				req.user = user;
				console.log(user);
				return res.send({"Message":"Succesful login"});
			}
		});
	})(req, res, next);
};
