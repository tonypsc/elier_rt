const getUnread = require('./getUnread');

describe('getUnread', () => {
	test('should throw "Wrong user id" for empty id', () => {
		expect(getUnread._invoke()).rejects.toThrow('Wrong user id');
	});

	test('should return empty array', async () => {
		await expect(getUnread._invoke('sdfee')).resolves.toEqual([]);
	});

	test('should return array', async () => {
		await expect(
			getUnread._invoke('ksypvhgb008d4792fbe0d70112c46e63')
		).resolves.not.toEqual([]);
	});
});
