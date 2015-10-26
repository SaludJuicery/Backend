//importing DB config details
var DB = require('../config/db').DB;

//mapping a single row of menu_categories table to this variable
var menu_item = DB.Model.extend({
	tableName: 'menu_items',
	idAttribute: 'item_name'
});


//exporting our table object for use in other modules/files
module.exports = {
	menu_item: menu_item
};
