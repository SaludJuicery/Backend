var knex = new require('../../config/db').knex;

exports.updateRestaurantTimings = function (req, res, next) {
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
        return res.send({ "Message": "103" }); // User do not have access to this resource
    
    //checking if required data is present
    if(!req.body.location || !req.body.timings)
        return res.send({ "Message": "401" }); // Required data not found in post request

    //formatting to JSON format
    var parsedvals = req.body.timings.split('#');

    for(var i=0; i<parsedvals.length; i++){
    	parsedvals[i] = parsedvals[i].replace(String.fromCharCode(92),'');
    	console.log(parsedvals[i]);
    }	

    //Using knex - much simpler than bookshelf.js
    knex('restaurent_hours').where('location',req.body.location).del()
      .then(function(rows) {
        console.log(rows);
        knex('restaurent_hours').insert(parsedvals).then(function (rows){ 
            console.log(rows);
            return res.send({ "Message": "777" }); // Operation Success
            }).catch(function (err){
            console.log(err)
            return res.send({ "Message": "403" }); // PK / FK Violation
            });
      }).catch(function(error) {
        return res.send({ "Message": "403" }); // DB Error
      });

};

