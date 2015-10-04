exports.logout = function (req, res, next) {
    
    //Checking first, if the user is already authenticated => his session is alive! => there exists a 'user' object set in the req
    if (req.user) {
	    req.session.destroy(function (err) {
	    return res.send({"Message": "Succesfully logged out!"}); //Inside a callback… bulletproof!
	 	});
    }
    else
    	return res.send({"Message": "You are not even logged in! -_-"});
};
