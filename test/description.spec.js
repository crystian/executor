const { expect } = require('chai');
const { assert } = require('chai');
const { buildCommand, buildCommandWithConfig } = require('../lib/command');
const path = require('path');

describe('setDescription() throws', function() {

	// throws

	it('should throw an error by invalid arguments', function() {
		assert.throw(() => {
			buildCommand();
		});
		assert.throw(() => {
			buildCommand('');
		});
		assert.throw(() => {
			buildCommand([]);
		});
		assert.throw(() => {
			buildCommand({});
		});
	});
});
