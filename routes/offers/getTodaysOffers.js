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

    if (!req.body.current_date_time)
        return res.send({ "Message": "401" }); // User do not have access to this resource

    // //Getdate time
    // var utcTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    // console.log('UTC Time: '+utcTime);

    // var estTime = moment.tz(currentDateTime, "America/Los_Angeles");
    // console.log('Current datetime in EST: '+estTime);

    //Using knex - much simpler than bookshelf.js
    knex.select('*').from('offers').where('start_date','<=',req.body.current_date_time).andWhere('end_date','>=',req.body.current_date_time).then(function(rows) {
        console.log(rows);
        return res.send(rows);
      }).catch(function(error) {
        return res.send({ "Message": "403" }); // DB Error
      });
    
};