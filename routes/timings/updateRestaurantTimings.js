var knex = new require('../../config/db').knex;

exports.updateRestaurantTimings = function (req, res, next) {
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
        return res.send({ "Message": "103" }); // User do not have access to this resource
    
    //checking if required data is present
    if(!req.body.location || !req.body.day || !req.body.open_time || !req.body.close_time || !req.body.is_open)
        return res.send({ "Message": "401" }); // Required data not found in post request

    knex('restaurant_hours').whereRaw("location='"+req.body.location+"' and day='"+req.body.day+"'")
    .update({
        open_time: req.body.open_time,
        close_time: req.body.close_time,
        is_open: req.body.is_open
    }).then(function(response) {
      console.log(response);
      console.log(knex.query);
      if(response == 0){
        console.log(knex.query);
        return res.send({"Message": "406"}); //nothing updated
      }
        return res.send({"Message": "777"});
    }).catch(function(error) {
        console.log(knex.query);
        console.log(error);
        return res.send({ "Message": "403" }); // DB Error
    });

};

