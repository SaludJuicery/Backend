// custom library
// model
var menu_items_table = require('../../models/menuItem').menu_items;
//var knex = new require('../../config/db').knex;


exports.sendCategoryItems = function (req, res, next) {
	//Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
    	return res.send({ "Message": "103" }); // User do not have access to this resource
    
    //checking if required data is present
    if(!req.body.category)
    	return res.send({ "Message": "401" }); // Required data not found in post request

    //using the mapped tabed(bookshelf.js maps it for us)
    menu_items_table.forge({category: req.body.category})
    .fetchAll()
    .then(function (rows){ // used save(null, {method: 'insert'}), otherwise bookshelf is thinking this as an update query
    	console.log(rows);
    	return res.send(rows.toJSON()); // Operation Success
    })
    .catch(function (err){
    	console.log(err)
    	return res.send({ "Message": "403" }); // DB Error
    });
};

