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

  var myArray = new Array();

  //Using knex - much simpler than bookshelf.js
  knex.select(knex.raw('SUM(order_sum)'), knex.raw('COUNT(*)')).from('orders').whereNot({
      is_order_served: 'cancelled'
    })
    .then(function(rows) {
      myArray['0'] = rows[0];
      //Using knex - much simpler than bookshelf.js
      knex.select('item_name', knex.raw('COUNT(item_name)')).from('ordered_items_count').groupBy('item_name').orderBy(knex.raw('COUNT(item_name)'), 'desc')
        .then(function(rows) {
          myArray['1'] = rows;

          console.log(myArray)

          return res.send({'Message': myArray});

        }).catch(function(error) {
          myArray['top5'] = {};
        });

    }).catch(function(error) {
      myArray['total_net_sales'] = 0;
      myArray['total_transactions'] = 0;
    });



};