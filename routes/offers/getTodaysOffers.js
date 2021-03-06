var knex = new require('../../config/db').knex;
// var moment = require('moment');
// var tz = require('moment-timezone');

exports.getTodaysOffers = function (req, res, next) {
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
        return res.send({ "Message": "103" }); // User do not have access to this resource

    //Using knex - much simpler than bookshelf.js
    knex.select('*').from('offers').where(knex.raw('`start_date` <= CURRENT_TIMESTAMP()')).andWhere(knex.raw('`end_date` >= CURRENT_TIMESTAMP()')).then(function(rows) {
        console.log(rows);
        return res.send(rows);
      }).catch(function(error) {
        return res.send({ "Message": "403" }); // DB Error
      });
    
};