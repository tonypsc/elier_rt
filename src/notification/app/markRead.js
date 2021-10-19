const CustomError = require('../../error/CustomError');
const db = require('../../services/database');

module.exports = {
	async _invoke(notification_id) {
		if (!notification_id) throw new CustomError('Wrong notification id');
		const sql = 'UPDATE notification SET readed = 1 WHERE notification_id = ?';
		return await db.execute(sql, [notification_id]);
	},
};
