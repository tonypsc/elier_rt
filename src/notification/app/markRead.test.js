const markRead = require('./markRead');

describe('markRead', () => {
	test('should throw error for empty id', async () => {
		await expect(markRead._invoke()).rejects.toThrow('Wrong notification id');
	});

	test('should mark', async () => {
		await expect(
			markRead._invoke('kt8tedbceb3091ff33e3dca2b112d65f')
		).resolves.toHaveProperty('affectedRows', 1);
	});
});
