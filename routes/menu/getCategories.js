// custom library
// model
var categoryTable = require('../../models/categoryTable').menu_categories;

exports.sendCategories = function (req, res, next) {
	//Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
    	return res.send({ "Message": "103" }); // User do not have access to this resource

    //using the mapped tabed(bookshelf.js maps it for us)
    categoryTable.forge().fetchAll().then(function (collection){
    	console.log(collection);
        if(collection !== null)
    	   return res.send(collection.toJSON()); // Operation Success
        
        return res.send({ "Message": "404" }); // Empty table
    }).catch(function (err){
    	console.log(err)
    	return res.send({ "Message": "402" }); // Database error
    });
};
