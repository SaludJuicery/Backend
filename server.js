var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
var GoogleTokenStrategy = require('passport-google-token').Strategy;

var app = express();

//Add pths here
var routes = require('./routes');
var Model = require('./models/model');
var logout = require('./routes/passport/logout.js');
var passportLocal = require('./routes/passport/passportLocal.js');
var facebookAuth = require('./routes/passport/facebookAuth.js');
var google = require('./routes/passport/google.js');
var signup = require('./routes/signup.js');
var knex = new require('./config/db').knex;
var configAuth = require('./config/auth');

var createCategory = require('./routes/menu/createCategory.js');
var getCategories = require('./routes/menu/getCategories.js');
var createMenuItem = require('./routes/menu/createMenuItem.js');
var createAddons = require('./routes/menu/createAddons.js');
var getCategoryItems = require('./routes/menu/getCategoryItems.js');
var updateMenuItem = require('./routes/menu/updateMenuItem.js');
var deleteMenuItems = require('./routes/menu/deleteMenuItems.js');
var createOffer = require('./routes/offers/createOffer.js');
var getTodaysOffers = require('./routes/offers/getTodaysOffers.js');
var updateOffer = require('./routes/offers/updateOffer.js');
var deleteOffers = require('./routes/offers/deleteOffers.js');
var getRestaurantTimings = require('./routes/timings/getRestaurantTimings.js');
var updateRestaurantTimings = require('./routes/timings/updateRestaurantTimings.js');
var getMenu = require('./routes/menu/getMenu.js');
var getAddons = require('./routes/menu/getAddons.js');
var createOrder = require('./routes/order/createOrder.js');
var getHourlySales = require('./routes/analytics/hourlySales.js');
var getDailySales = require('./routes/analytics/dailySales.js');
var getOrders = require('./routes/order/getOrders.js');
var cancelOrder = require('./routes/order/cancelOrder.js');
var dashboard = require('./routes/analytics/dashboard.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(session({
	secret: 'saludyahoo!',
	//store: sessionStore, // connect-mongo session store
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	knex.select('*').from('users').where({
			'username': user.username
		})
		.then(function(rows) {
			done(null, rows[0]);
		}).catch(function(err) {
			done(err);
		});
});

passport.use(new LocalStrategy(function(username, password, done) {
	new Model.DBUser({
		username: username
	}).fetch().then(function(data) {
		var user = data;
		console.log("The user name form post request is " + username);
		console.log("The password got form post request is " + password);
		if (user === null) {
			console.log("In passport.use, user object is null");
			return done(null, false, {
				message: 'Invalid username or password'
			});
		} else {
			user = {
				username: data.attributes.username,
				password: data.attributes.password
			};
			if (password !== user.password) {
				console.log("Passwords are not same");
				return done(null, false, {
					message: 'Incorrect password'
				});
			} else {
				console.log(password + " == " + user.password)
				return done(null, user);
			}
		}
	});
}));

/*passport.use(new FacebookTokenStrategy ({

		clientID: configAuth.googleAuth.clientID,
		clientSecret: configAuth.googleAuth.clientSecret

	},
	function(token, refreshToken, profile, done) {
		console.log("facebook auth invoked");

		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from Google
		process.nextTick(function() {
			//search if user exists
			knex.select('*').from('users').where({
					'username': profile.id
				})
				.then(function(rows) {
					if (rows.length > 0) {
						return done(null, rows[0]);
					} else {
						console.log("came to else");
						knex('users').insert({
								username: profile.emails[0].value,
								password: profile.id
							})
							.then(function(response) {
								console.log("Auth Success. ProfileID"+profile.id);
								return done(null, {
									username: profile.emails[0].value,
									password: profile.id
								});
							}).catch(function(err) {
								console.log("Issue with Token");
								return done(null, false, {
									message: 'Incorrect password'
								});
							});
					}
				}).catch(function(err) {
					console.log("Issue with knex");
					return done(null, false, {
						message: 'Issue with token'
					});
				});

		});

	}));*/


passport.use(new GoogleTokenStrategy({

		clientID: configAuth.googleAuth.clientID,
		clientSecret: configAuth.googleAuth.clientSecret

	},
	function(token, refreshToken, profile, done) {
		console.log("google auth invoked");
		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from Google
		process.nextTick(function() {
			//search if user exists
			knex.select('*').from('users').where({
					'username': profile.id
				})
				.then(function(rows) {
					if (rows.length > 0) {
						return done(null, rows[0]);
					} else {
						knex('users').insert({
								username: profile.emails[0].value,
								password: profile.id
							})
							.then(function(response) {
								console.log("Auth Success. ProfileID"+profile.id);
								return done(null, {
									"username": profile.emails[0].value,
									"password": profile.id
								});
							}).catch(function(err) {
								return done(err);
							});
					}
					return res.send(rows);
				}).catch(function(err) {
					return done(err);
				});

		});

	}));



app.use('/', routes);
//Routes Concerning Authentication
app.post('/auth/login', passportLocal.dbLoginPost);
app.post('/auth/facebookAuth', facebookAuth.fbLoginPost);
app.post('/auth/logout', logout.logout);
app.post('/auth/signup', signup.signup);
app.post('/auth/googleAuth', google.google);

//Routes Concerning Menu
app.post('/menu/category/insert', createCategory.insertCategory);
app.post('/menu/categories/get', getCategories.sendCategories);
app.post('/menu/menuItem/insert', createMenuItem.insertMenuItem);
app.post('/menu/addons/insert', createAddons.insertAddons);
app.post('/menu/category/menuItems/get', getCategoryItems.sendCategoryItems);
app.post('/menu/menuItem/update', updateMenuItem.updateMenuItem);
app.post('/menu/menuItems/delete', deleteMenuItems.deleteMenuItems);
//Routes Concerning Orders - Restaurent Side
app.post('/orders/get', getOrders.getOrders);
app.post('/order/cancel', cancelOrder.cancelOrder);
//Routes concerning offers
app.post('/offers/insert', createOffer.createOffer);
app.post('/offers/todays/get', getTodaysOffers.getTodaysOffers);
app.post('/offer/update', updateOffer.updateOffer);
app.post('/offers/delete', deleteOffers.deleteOffers);
//Config items
app.post('/restaurant/timings/get', getRestaurantTimings.getRestaurantTimings);
app.post('/restaurant/timings/update', updateRestaurantTimings.updateRestaurantTimings);
//Enduser Interfaces
app.post('/menu/get', getMenu.getMenu);
app.post('/menu/addons/get', getAddons.getAddons);
app.post('/salud/order/insert', createOrder.createOrder);
app.post('/analytics/dailySales/get', getDailySales.getDailySales);
app.post('/analytics/hourlySales/get', getHourlySales.getHourlySales);
app.post('/analytics/dashboard/get', dashboard.dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});