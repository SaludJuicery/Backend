var DB = require('../config/db').DB;

var DBUser = DB.Model.extend({
	tableName: 'users',
	idAttribute: 'username',
});

module.exports = {
	DBUser: DBUser
};