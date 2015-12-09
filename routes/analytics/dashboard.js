var knex = new require('../../config/db').knex;


exports.dashboard = function(req, res, next) {
  //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
  if (!req.user)
    return res.send({
      "Message": "101"
    }); // User Not Authenticated

  //checking if user has access to the resource
  if (req.user.username !== 'salud.partner@gmail.com')
    return res.send({
      "Message": "103"
    }); // User do not have access to this resource

          //checking if required data is present
    if(!req.body.location)
      return res.send({ "Message": "401" }); // Required data not found in post request



  var jSONdata = {};

  //Using knex - much simpler than bookshelf.js
  knex.select(knex.raw('SUM(order_sum) as net_sales'), knex.raw('COUNT(*) as transactions')).from('orders').whereNot({
      is_order_served: 'cancelled'
    }).where('location','=',req.body.location)
    .then(function(rows) {
      jSONdata['net_sales'] = rows[0].net_sales;
      jSONdata['transactions'] = rows[0].transactions;
      //Using knex - much simpler than bookshelf.js
      knex.select('item_name', knex.raw('COUNT(item_name) as item_count')).from('ordered_items_count').groupBy('item_name').orderBy(knex.raw('COUNT(item_name)'), 'desc')
        .then(function(rows) {
          jSONdata['one'] = rows[0].item_name;
          jSONdata['two'] = rows[1].item_name;
          jSONdata['three'] = rows[2].item_name;
          jSONdata['four'] = rows[3].item_name;
          jSONdata['five'] = rows[4].item_name;

          return res.send(jSONdata);

        }).catch(function(error) {
          return res.send({"Message": "Error"});
        });

    }).catch(function(error) {
        return res.send({"Message": "Error"});
    });
};