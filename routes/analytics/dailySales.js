var knex = new require('../../config/db').knex;


exports.getDailySales = function (req, res, next) {
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
      return res.send({ "Message": "103" }); // User do not have access to this resource

        //checking if required data is present
    if(!req.body.location)
      return res.send({ "Message": "401" }); // Required data not found in post request

    
    //Using knex - much simpler than bookshelf.js
    knex.select(knex.raw('DAYNAME(date)'), knex.raw('DATE(date)'), knex.raw('SUM(order_sum)')).from('orders').where(knex.raw('WEEKOFYEAR(date) = WEEKOFYEAR(NOW())')).andWhere('location','=',req.body.location).groupByRaw(knex.raw('DATE(date)'))
      .then(function(rows) {
        console.log(rows);
        return res.send(rows);
      }).catch(function(error) {
        console.log(knex.query);
        return res.send({ "Message": "403" }); // DB Error
        console.log(knex.query);
      });
    
};