var knex = new require('../../config/db').knex;

exports.getAddons = function (req, res, next) {
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    // if (!req.user) 
    //     return res.send({ "Message": "101" }); // User Not Authenticated

    //Using knex - much simpler than bookshelf.js
    knex.select('*').from('addons').orderByRaw('addon_name')
      .then(function(rows) {
        console.log(rows);
        return res.send(rows);
      }).catch(function(error) {
        return res.send({ "Message": "403" }); // DB Error
      });
};