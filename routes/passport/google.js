// vendor library
var passport = require('passport');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var knex = new require('../../config/db').knex;
var configAuth = require('../../config/auth');

exports.google = function(req, res, next) {

    console.log("Entered google login");
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (req.user) {
        return res.send({
            "Message": "You are already logged in!"
        });
    }

    console.log("No user found in session object. Fwding to passport.authenticate");
    //If not let passport handle the autentication

    /*    passport.authenticate('google-token'),
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

            }*/

    /*    passport.authenticate('google-token', function(err, user, info) {
            if (err) {
                return res.send({
                    'Message': err.message
                }, {
                    'request': req
                });
            }
            if (!user) {
                console.log("In exports.dbLoginPost, user object is null");
                return res.send({
                    'Message': 'Username password combination incorrect'
                });
            }
            return req.logIn(user, function(err) {
                if (err) {
                    return res.send({
                        'Message': err.message
                    });
                } else {
                    req.user = user;
                    console.log(user);
                    return res.send({
                        "Message": "Succesful login"
                    });
                }
            });
        })(req, res, next);
    */
    passport.authenticate('google-token', function(err, user, info) {
        if (!user) {
            console.log("In exports.dbLoginPost, user object is null");
            return res.send({
                'Message': 'Username password combination incorrect'
            });
        } else {
            return req.logIn(user, function(err) {
                if (err) {
                    return res.send({
                        'Message': err.message
                    });
                } else {
                    req.user = user;
                    console.log(user);
                    return res.send({
                        "Message": "Succesful login"
                    });
                }
            });
        }

    })(req, res, next);

};