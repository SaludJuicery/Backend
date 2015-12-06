var knex = new require('../../config/db').knex;

// Set your secret key: remember to change this to your live secret key in production
var stripe = require("stripe")(process.env.stripe_test_secret);


exports.createOrder = function(req, res, next) {
  //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
  if (!req.user) 
      return res.send({ "Message": "User not authenticated" }); // User Not Authenticated

  // check if calling user is same as authenticated user
  if(req.user.username != req.body.email){
    return res.send({"Message": "User not authorized"});
  }

  if (!req.body.stripeToken || !req.body.email || !req.body.order || !req.body.location || !req.body.order_sum || !req.body.items)
    return res.send({
      "Message": "103"
    }); // Required Data not Found

  console.log(req.body.stripeToken);

  var items = req.body.items.split(',');

  /*  for(var i=0; i<order.length; i++){
      // items = items + "'" + order[i].split(',')[1] + "'";
      items.[i] = order[i].split(',')[1];
    }*/

  knex.select('*').from('menu_items').whereIn('item_name', order).andWhere('is_available_' + req.body.location, '=', 'false')
    .then(function(rows) {
      console.log(rows);
      if (rows.length != 0) {
        return res.send({
          "Message": "400"
        });
      } else {
        //If all items are available, create a customer
        stripe.customers.create({
          source: req.body.stripeToken,
          description: 'Customer holding email ' + req.body.email,
          email: req.body.email
        }, function(err, charge) {
          if (err != null) {
            switch (err.type) {
              case 'StripeCardError':
                // A declined card error
                console.log(err.message);
                return res.send({
                  "Message": err.message
                }); //nothing updated
                break;
              case 'RateLimitError':
                // Too many requests made to the API too quickly
                console.log(err.message);
                return res.send({
                  "Message": err.message
                }); //nothing updated
                break;
              case 'StripeInvalidRequestError':
                // Invalid parameters were supplied to Stripe's API
                console.log(err.message);
                return res.send({
                  "Message": err.message
                }); //nothing updated
                break;
              case 'StripeAPIError':
                // An error occurred internally with Stripe's API
                console.log(err.message);
                return res.send({
                  "Message": err.message
                }); //nothing updated
                break;
              case 'StripeConnectionError':
                // Some kind of error occurred during the HTTPS communication
                console.log(err.message);
                return res.send({
                  "Message": err.message
                }); //nothing updated
                break;
              case 'StripeAuthenticationError':
                // You probably used an incorrect API key
                console.log(err.message);
                return res.send({
                  "Message": err.message
                }); //nothing updated
                break;
              default:
                console.log(err.message);
                return res.send({
                  "Message": err.message
                }); //nothing updated
                break;
            }
          }
        }).then(function(customer) { // Once the customer is created, create charge
          return stripe.charges.create({
            amount: req.body.order_sum, // amount in cents, again
            currency: "usd",
            customer: customer.id
          }, function(err, charge) { //Check if there are any issues here
            if (err) {
              console.log("Error :" + err);
              return res.send({
                "Message": err.message + ". Check " + err.param
              });
            }
          });
        }).then(function(charge) {
          // Once he has been charged for and charge is succesfull, save customer to DB for later use
          console.log("succesfully charged :" + charge.customer);
          console.log("Charge ID :" + charge.id);

          //Using knex - much simpler than bookshelf.js
          knex('orders').insert({
              stripe_charge_id: charge.id,
              stripe_customer_id: charge.customer,
              email: req.body.email,
              order_sum: req.body.order_sum,
              order: req.body.order,
              location: req.body.location,
              last4: charge.source.last4
            })
            .then(function(response) { //store items in a day
              console.log(items);
              var parsedValues = [];
              for (var i in items) {
                parsedValues.push({
                  item_name: items[i]
                });
              }
              //store ordered items for vivek
              knex('ordered_items_count').insert(parsedValues)
                .then(function(response) {
                  console.log(response);
                  return res.send({
                    "Message": "Success"
                  });
                }).catch(function(error) {
                  console.log(error);
                  return res.send({
                    "Message": "Oops there was an issue. Contact the restaurent"
                  }); // DB Error
                });
            }).catch(function(error) {
              console.log(error);
              return res.send({
                "Message": "Oops there was an issue. Contact the restaurent"
              }); // DB Error
            });
        });
      } // End of else that started for first db query - finding if db is updated
    }).catch(function(error) {
      return res.send({
        "Message": "Opees there was an issue. Try again in some time"
      }); // DB Error
    });
};