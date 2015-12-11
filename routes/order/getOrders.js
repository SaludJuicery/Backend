var knex = new require('../../config/db').knex;
// var moment = require('moment');
// var tz = require('moment-timezone');

exports.getOrders = function(req, res, next) {
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user)
        return res.send({
            "Message": "101"
        }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
        return res.send({
            "Message": "103"
        }); // User do not have access to this resource

    //checking if required data is present
    if (!req.body.location)
        return res.send({
            "Message": "401"
        }); // Required data not found in post request

    //Using knex - much simpler than bookshelf.js
    knex.select(knex.raw('DATE(date) as date'), knex.raw('TIME(date) as time'), 'order', 'orderid', 'email').from('orders').where('location', '=', req.body.location).andWhere('is_order_served', '=', 'false').orderBy('date', 'desc')
        .then(function(rows) {
            for (var i = 0; i < rows.length; i++) {
                rows[i]['date'] = rows[i]['date'].toString().substr(4,11);
            }
            console.log(rows);

            return res.send(rows);
        }).catch(function(error) {
            console.log(error);
            return res.send({
                "Message": "403"
            });
        });

};