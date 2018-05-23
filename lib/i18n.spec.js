const { assert } = require('chai');
const { messages } = require('../lib/i18n');

describe('messages', function() {
	it('should get a message from i18n file', function() {
		assert.doesNotThrow(() => {
			assert.isOk(messages.test);
		});
		assert.doesNotThrow(() => {
			assert.isOk(messages.test.test);
			assert.equal(messages.test.test, 'do not modify it');
		});
	});

	it('should throw an error by message not found', function() {
		assert.throw(() => {
			assert.isOk(messages.invalid.message);
		});
	});
});
