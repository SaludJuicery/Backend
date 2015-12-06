module.exports = {

	'facebookAuth': {
		'clientID': process.env.facebook_app_ID, // your App ID
		'clientSecret': process.env.facebook_app_secret, // your App Secret
		'callbackURL': 'http://localhost:8080/auth/facebook/callback'
	},

	'googleAuth': {
		'clientID': '155484883695-pnnmjfvjd39gtsua0psarsudhibhvg2s.apps.googleusercontent.com',
		'clientSecret': '-uO_9ukwJpF_njaJwy_h1hEP'
	}

};