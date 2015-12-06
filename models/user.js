var DB = require('../config/db').DB;

var User = DB.Model.extend({
	tableName: 'users',
	idAttribute: 'username',
});

module.exports = {
	User: User
};