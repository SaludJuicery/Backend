//importing DB config details
var DB = require('../config/db').DB;

//mapping menu_categories object to our table in database
var menu_categories = DB.Model.extend({
	tableName: 'menu_categories',
	idAttribute: 'category_name'
});

//exporting our table object for use in other modules/files
module.exports = {
	menu_categories: menu_categories
};

