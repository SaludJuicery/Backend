// custom library
// model
var menu_items_table = require('../../models/menuItem').menu_item;


exports.insertMenuItem = function (req, res, next) {
	//Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
    	return res.send({ "Message": "103" }); // User do not have access to this resource
    
    //checking if required data is present
    if(!req.body.item_name || !req.body.category || !req.body.petite || !req.body.description || !req.body.regular || !req.body.growler || !req.body.is_available_shady || !req.body.is_available_sewickley)
    	return res.send({ "Message": "401" }); // Required data not found in post request
    console.log(req.body);


    //using the mapped tabed(bookshelf.js maps it for us)
    menu_items_table.forge({item_name: req.body.item_name,
        category: req.body.category,
        petite: req.body.petite,
        regular: req.body.regular,
        growler: req.body.growler,
        description: req.body.description,
        is_available_shady: req.body.is_available_shady,
        is_available_sewickley: req.body.is_available_sewickley
    }).save(null, {method: 'insert'}).then(function (rows){ // used save(null, {method: 'insert'}), otherwise bookshelf is thinking this as an update query
    	console.log(rows);
    	return res.send({ "Message": "777" }); // Operation Success
    }).catch(function (err){
    	console.log(err)
    	return res.send({ "Message": "403" }); // PK / FK Violation
    });
};

