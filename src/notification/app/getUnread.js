const db = require('../../services/database');
const CustomError = require('../../error/CustomError');

module.exports = {
	async _invoke(user_id) {
		console.log({ user_id });
		if (!user_id) throw new CustomError('Wrong user id');
		const sql = 'SELECT * FROM notification WHERE user_id = ?';
		return await db.execute(sql, [user_id]);
	},
};
