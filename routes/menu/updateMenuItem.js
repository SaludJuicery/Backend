var knex = new require('../../config/db').knex;

exports.updateMenuItem = function (req, res, next) {
	//Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
    	return res.send({ "Message": "103" }); // User do not have access to this resource
    
    //checking if required data is present
    if(!req.body.item_name || !req.body.category || !req.body.price || !req.body.description)
        return res.send({ "Message": "401" }); // Required data not found in post request

    //Using knex - much simpler than bookshelf.js
    knex('menu_items').where({'item_name': req.body.item_name})
    .update({
        item_name: req.body.item_name,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description
    })
    .then(function(response) {
      console.log(response);
      if(response == 0)
        return res.send({"Message": "406"});
    
        return res.send({"Message": "777"});
    }).catch(function(error) {
        return res.send({ "Message": "403" }); // DB Error
    });
    
};