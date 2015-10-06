var knex = require('knex')({
	client: 'mysql',
	connection: {
		host: process.env.salud_db_host,  // your host
		user: process.env.salud_db_user,
		password: process.env.salud_db_password, 
		database: process.env.salud_db_database,
		port: process.env.salud_db_port,
		charset  : 'utf8'
	}
});

var DB = require('bookshelf')(knex);

module.exports = {
	DB: DB, knex: knex
};