var knex = require('knex')({
	client: 'mysql',
	connection: {
		host: 'saluddb.cazv88oyo3vo.us-west-2.rds.amazonaws.com',  // your host
		user: 'salud',
		password: 'SaludRDS', 
		database: 'saluddb',
		port: 3306,
		charset  : 'utf8'
	}
});

module.exports.DB = require('bookshelf')(knex);