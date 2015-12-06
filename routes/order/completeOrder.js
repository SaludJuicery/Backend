var knex = new require('../../config/db').knex;

exports.completeOrder = function (req, res, next) {
	//Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
    	return res.send({ "Message": "103" }); // User do not have access to this resource
    
    //checking if required data is present
    if(!req.body.orderid)
        return res.send({ "Message": "401" }); // Required data not found in post request

    //Using knex - much simpler than bookshelf.js
    knex('orders').where({'orderid': req.body.orderid})
    .update({
        is_order_served: 'true'
    })
    .then(function(response) {
      console.log(response);
      if(response == 0)
        return res.send({"Message": "406"}); //nothing updated
    
        return res.send({"Message": "777"});
    }).catch(function(error) {
        return res.send({ "Message": "403" }); // DB Error
    });
    
};