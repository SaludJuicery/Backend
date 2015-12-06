// vendor library
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');

exports.fbLoginPost = function(req, res, next) {

    console.log("Entered fbLoginPost");

    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (req.user) {
        return res.send({
            "Message": "You are already logged in!"
        });
    }

    console.log("No user found in session object. Fwding to passport.authenticate");
    //If not let passport handle the autentication

    passport.authenticate('facebook-token'),
        function(req, res) {
            if (req.user) {
                return res.send({
                    "Message": "Welcome " + req.user.username
                });
            } else {
                return res.send({
                    "Message": "Auth Failure"
                });
            }
        }
};