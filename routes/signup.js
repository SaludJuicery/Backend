var knex = new require('../config/db').knex;


exports.signup = function (req, res, next) {  
    //checking if required data is present
    if(!req.body.username || !req.body.password)
    	return res.send({ "Message": "401" }); // Required data not found in post request

    //Using knex - much simpler than bookshelf.js
    knex('users').insert({
        username: req.body.username,
        password: req.body.password
    })
    .then(function(response) {
      console.log(response);
        return res.send({"Message": "Success"});
    }).catch(function(error) {
        console.log(error);
        return res.send({ "Message": "Opps, there was an issue! Please try in some time" }); // DB Error
    });
};