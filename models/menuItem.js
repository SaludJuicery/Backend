//importing DB config details
var DB = require('../config/db').DB;

//mapping menu_categories object to our table in database
var menu_items = DB.Model.extend({
	tableName: 'menu_items',
	idAttribute: 'item_name'
});

//exporting our table object for use in other modules/files
module.exports = {
	menu_items: menu_items
};

