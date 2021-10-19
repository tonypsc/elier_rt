const mysql = require('mysql2');
const { config } = require('../config');

function connection() {
	try {
		let dbSettings = {
			debug: false,
			host: config.db_host,
			user: config.db_user,
			password: config.db_pass,
			database: config.db_name,
			connectionLimit: 10,
			waitForConnections: true,
			queueLimit: 0,
		};
		let pool = mysql.createPool(dbSettings);
		return pool.promise();
	} catch (error) {
		return console.log(`Could not connect - ${error}`);
	}
}

const pool = connection();

module.exports = {
	query: async (...params) => {
		try {
			let connection = await pool.getConnection();
			let [data] = await connection.query(...params);
			await connection.release();
			return data;
		} catch (e) {
			console.log(e);
		}
	},

	execute: async (...params) => {
		try {
			let connection = await pool.getConnection();
			let [data] = await connection.execute(...params);
			await connection.release();
			return data;
		} catch (e) {
			console.log(e);
		}
	},
};
