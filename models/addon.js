//importing DB config details
var DB = require('../config/db').DB;

//mapping menu_categories object to our table in database
var addons = DB.Model.extend({
	tableName: 'addons',
	idAttribute: 'addon_name' // primary key
});

//exporting our table object for use in other modules/files
module.exports = {
	addons: addons
};

