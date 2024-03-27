const a = require('../functions/a');

test('adds 1 + 2 to equal 3', () => {
	expect(a(1, 2)).toBe(3);
});
