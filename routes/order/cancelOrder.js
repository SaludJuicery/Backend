var knex = new require('../../config/db').knex;

// Set your secret key: remember to change this to your live secret key in production
var stripe = require("stripe")(process.env.stripe_test_secret);


exports.cancelOrder = function(req, res, next) {
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
    if (!req.body.order_to_cancel)
        return res.send({
            "Message": "401"
        }); // Required data not found in post request

    var stripe_charge;
    var message;

    knex.select('stripe_charge_id').from('orders').where('orderid', '=', req.body.order_to_cancel)
        .then(function(rows) {
            if (rows.length === 0) {
                return res.send({
                    "Message": "No such order exists"
                });
            }
            console.log(rows);
            stripe_charge = rows[0].stripe_charge_id;

            //Once we have the charge_id cancel it
            stripe.refunds.create({
                charge: stripe_charge
            }, function(err, refund) {
                //If there is an error dont proceed any further
                if (err != null) {
                    console.log(err);
                    return res.send({
                        "Message": err
                    });
                }

                //Refund Success => update the DB
                else {
                    console.log(refund);
                    knex('orders').where({
                            'orderid': req.body.order_to_cancel
                        })
                        .update({
                            is_order_served: 'cancelled'
                        })
                        .then(function(response) {
                            console.log(response);
                            if (response == 0) {
                                return res.send({
                                    "Message": "No rows updated. No such order exists"
                                }); //nothing updated
                            } else {
                                return res.send({
                                    "Message": "Success"
                                });
                            }

                        }).catch(function(error) {
                            console.log("Error in updating DB to cancel");
                            return res.send({
                                "Message": error
                            }); // DB Error
                        });
                }
            });

            return res.send(rows);
        }).catch(function(error) {
            console.log(error)
                return res.send({
                    "Message": error
                });
        });

    return res.send({
        "Message": message
    });

};