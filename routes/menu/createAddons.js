// custom library
// model
//var addons_table = require('../../models/addon').addons;
var knex = new require('../../config/db').knex;

exports.insertAddons = function (req, res, next) {
	//Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

    //checking if user has access to the resource
    if (req.user.username !== 'salud.partner@gmail.com')
    	return res.send({ "Message": "103" }); // User do not have access to this resource
    
    //checking if required data is present
    if(!req.body.addons)
    	return res.send({ "Message": "401" }); // Required data not found in post request

    console.log(req.body.addons);   //check the input for debugging purpose

    //Knex accepts multi row insert in the following format [{},{}] => we need to model our input that way
    var parsedValues = []; // we will store the the vaules we wish to send to knex here
    try {
        //more sanity check is to be done
        var arr = req.body.addons.split(',');
    }catch(err){
        return res.send({ "Message": "405" }); // Data not sent in proper format
    }

    for (var i in arr) {
        parsedValues.push({addon_name: arr[i]});
    }
    console.log(parsedValues);

    knex('addons').insert(parsedValues).then(function (rows){ 
        console.log(rows);
        return res.send({ "Message": "777" }); // Operation Success
    }).catch(function (err){
        console.log(err)
        return res.send({ "Message": "403" }); // PK / FK Violation
    });
};

