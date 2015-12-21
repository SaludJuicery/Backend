var knex = new require('../../config/db').knex;


exports.getUsers = function (req, res, next) {
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (!req.user) 
        return res.send({ "Message": "101" }); // User Not Authenticated

  //checking if required data is present
    if(req.user.username !== 'salud.partner@gmail.com')
        return res.send({ "Message": "103" }); // Required data not found in post request

    //Using knex - much simpler than bookshelf.js
      knex('users').distinct('username').select()
      .then(function(rows) {
        console.log(rows);
        return res.send(rows);
      }).catch(function(error) {
        return res.send({ "Message": "403" }); // DB Error
      });



    
};

//    
