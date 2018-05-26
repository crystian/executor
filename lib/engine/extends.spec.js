const { assert } = require('chai');
const { setColor } = require('./extends');

describe('toTemplate()', function() {

	it('should resolve without template', function() {
		assert.equal('simple string with a template ${value}'.toTemplate(''), 'simple string with a template ${value}');
	});
	it('should resolve with a template', function() {
		assert.equal('simple string with a template ${value}'.toTemplate({ value: 'it' }), 'simple string with a template it');
	});
	it('should resolve with a wrong template', function() {
		assert.equal('simple string with a template ${value}'.toTemplate({ invalid: 'it' }), 'simple string with a template ${value}');
	});
	it('should resolve with a sub-template', function() {
		assert.equal('simple string with a template ${value.internal}'.toTemplate({ value: { internal: 'it' } }), 'simple string with a template it');
	});
	it('should resolve with a wrong sub-template', function() {
		assert.equal('simple string with a template ${value.internal}'.toTemplate({ value: { invalid: 'it' } }), 'simple string with a template ${value.internal}');
	});

});


describe('setColor()', function() {
	it('should return an array with the color in element 0', () => {
		let r = setColor(true, 'color1', ['arg1']);

		assert.equal(r[0], 'color1');
		assert.equal(r[1], 'arg1');
		assert.equal(r.length, 2);
	});
	it('should return an array without the color in element 0', () => {
		let r = setColor(false, 'color1', ['arg1']);

		assert.equal(r[0], 'arg1');
		assert.equal(r.length, 1);
	});
});
