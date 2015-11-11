// custom library
// model
var categoryTable = require('../../models/categoryTable').menu_categories;

exports.insertCategory = function (req, res, next) {
	//Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
    	return res.send({ "Message": "103" }); // User do not have access to this resource
    
    //checking if required data is present
    if(!req.body.category_name)
    	return res.send({ "Message": "401" }); // Data not found in post request

    console.log("Pushing category name : "+req.body.category_name+" to menu_categories table");

    //using the mapped tabed(bookshelf.js maps it for us)
    categoryTable.forge({category_name: req.body.category_name}).save().then(function (rows){
    	console.log(rows);
    	return res.send({ "Message": "777" }); // Operation Success
    }).catch(function (err){
    	console.log(err)
    	return res.send({ "Message": "403" }); // Database error
    });
};