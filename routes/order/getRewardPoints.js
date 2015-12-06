var knex = new require('../../config/db').knex;
// var moment = require('moment');
// var tz = require('moment-timezone');

exports.getRewardPoints = function(req, res, next) {
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user)
        return res.send({
            "Message": "101"
        }); // User Not Authenticated

    console.log('YOOO');

    //Using knex - much simpler than bookshelf.js
    knex.select('reward_points').from('users').where('username', '=', req.user.username)
        .then(function(rows) {
            console.log(rows);
            return res.send(rows);
        }).catch(function(error) {
            return res.send({
                "Message": "403"
            });
        });

};  