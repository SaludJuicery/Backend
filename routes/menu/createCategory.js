// custom library
// model
var categoryTable = require('../../models/categoryTable').menu_categories;
/*var mysql      = require('mysql'); // trying this instead of bookshelf
//connect to the database
    var pool = mysql.createPool({
		host: 'saluddb.cazv88oyo3vo.us-west-2.rds.amazonaws.com',  // your host
		user: 'process.env.salud_db_username',
		password: 'process.env.salud_db_password', 
		database: 'process.env.salud_db_database',
		port: process.env.salud_db_port
	});*/


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



//Below method is written using MySQL library....Bookshelf gives more readability to code

/*exports.insertCategoryMySQL = function (req, res, next) {
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

	//Creating the connection only when necessary
	var query = "INSERT INTO ?? VALUES (?)";
	var table = ["menu_categories",req.body.category_name];
    query = mysql.format(query,table);
    var message;

	pool.getConnection(function (err, connection) {
	if (err) 
		console.log(err);
	
	console.log("Succesfully connected to database");

	connection.query(query,function(err,rows){
        if(err) {
        	console.log(err.stack);
        	//message = { "Message": "402" };
        	connection.release();
        	return res.send({ "Message": "403" }); // Database error
            
        } else {
        	console.log(query);
            console.log(rows);
            connection.release();
            //message = { "Message": "777" };
      		return res.send({ "Message": "777" }); // Operation Success
       	 	}
    	});
	});
};
*/