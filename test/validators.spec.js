const { assert } = require('chai');
const { validateAndBuildEnvironments, validateConfig, validateTemplates, validateShortcuts, validateShortcut } = require('../lib/validators');


describe('validateShortcut() throws', function() {

	// does not throw
	it('should return a false value by empty arguments', function() {
		assert.doesNotThrow(() => {
			let r = validateShortcut();
			assert.equal(r, false);
		});
		assert.doesNotThrow(() => {
			let r = validateShortcut({});
			assert.equal(r, false);
		});
		assert.doesNotThrow(() => {
			let r = validateShortcut('');
			assert.equal(r, false);
		});
		assert.doesNotThrow(() => {
			let r = validateShortcut([]);
			assert.equal(r, false);
		});
	});
	it('should not throw an error: 1 level', function() {
		assert.doesNotThrow(() => {
			validateShortcut('branchA');
		});
	});
	it('should not throw an error: 2 levels', function() {
		assert.doesNotThrow(() => {
			validateShortcut('branchA branchAA');
		});
	});
	it('should not throw an error: 3 levels', function() {
		assert.doesNotThrow(() => {
			validateShortcut('branchA branchAA branchAAA');
		});
	});
});


describe('validateConfig() throws', function() {

	// throws

	it('should throw an error by invalid arguments', function() {
		assert.throw(() => {
			validateConfig([]);
		});
		assert.throw(() => {
			validateConfig(1);
		});
		assert.throw(() => {
			validateConfig(null);
		});
		assert.throw(() => {
			validateConfig('');
		});
	});

	// does not throw

	it('should not throw an error by do not send arguments', function() {
		assert.doesNotThrow(() => {
			validateConfig();
		});
	});
	it('should not throw an error by an empty object', function() {
		assert.doesNotThrow(() => {
			validateConfig({});
		});
	});
});


describe('validateAndBuildEnvironments() throws', function() {

	// throws

	it('should throw an error by invalid arguments', function() {
		assert.throw(() => {
			validateAndBuildEnvironments({});
		});
		assert.throw(() => {
			validateAndBuildEnvironments(1);
		});
		assert.throw(() => {
			validateAndBuildEnvironments([1]);
		});
	});

	it('should throw an error by send an empty object', function() {
		assert.throw(() => {
			validateAndBuildEnvironments([{ key1: {} }]);
		});
	});

	// does not throw

	it('should not throw an error by do not send arguments', function() {
		assert.doesNotThrow(() => {
			validateAndBuildEnvironments();
		});
	});
	it('should not throw an error by send empty string', function() {
		assert.doesNotThrow(() => {
			validateAndBuildEnvironments('');
		});
	});
	it('should not throw an error by send a null', function() {
		assert.doesNotThrow(() => {
			validateAndBuildEnvironments(null);
		});
		assert.doesNotThrow(() => {
			validateAndBuildEnvironments([null]);
		});
	});
	it('should not throw an error by send an empty array', function() {
		assert.doesNotThrow(() => {
			validateAndBuildEnvironments([]);
		});
	});
	it('should not throw an error by correct arguments: string', function() {
		assert.doesNotThrow(() => {
			validateAndBuildEnvironments(['env1']);
		});
	});
	it('should not throw an error by correct arguments: object', function() {
		assert.doesNotThrow(() => {
			validateAndBuildEnvironments([{ key1: 'value1' }]);
		});
	});
	it('should not throw an error by correct arguments: object and string', function() {
		assert.doesNotThrow(() => {
			validateAndBuildEnvironments([{ key1: 'value1' }, 'key2']);
		});
	});
});

describe('validateAndBuildEnvironments() results', function() {
	it('should resolve the object', function() {
		let r = validateAndBuildEnvironments([{ key1: 'value1' }]);
		assert.deepEqual(r, [{ key1: 'value1' }]);
	});
	it('should resolve the string', function() {
		let r = validateAndBuildEnvironments(['key1']);
		assert.deepEqual(r, [{ key1: 'key1' }]);
	});
	it('should resolve the object x2', function() {
		let r = validateAndBuildEnvironments(['key1', 'key2']);
		assert.deepEqual(r, [{ key1: 'key1' }, { key2: 'key2' }]);
	});
	it('should resolve the object and string', function() {
		let r = validateAndBuildEnvironments([{ key1: 'value1' }, 'key2']);
		assert.deepEqual(r, [{ key1: 'value1' }, { key2: 'key2' }]);
	});
	it('should resolve the string and object', function() {
		let r = validateAndBuildEnvironments(['key1', { key2: 'value2' }]);
		assert.deepEqual(r, [{ key1: 'key1' }, { key2: 'value2' }]);
	});
});


describe('validateTemplates() throws', function() {

	// throws

	it('should throw an error by invalid arguments: 1 level', function() {
		assert.throw(() => {
			validateTemplates([]);
		});
		assert.throw(() => {
			validateTemplates({ key: 1 });
		});
		assert.throw(() => {
			validateTemplates({ key: null });
		});
	});

	it('should throw an error by invalid arguments: 2 level', function() {
		assert.throw(() => {
			validateTemplates({ branchA: { branchAA: [] } });
		});
		assert.throw(() => {
			validateTemplates({ branchA: { branchAA: 1 } });
		});
		assert.throw(() => {
			validateTemplates({ branchA: { branchAA: null } });
		});
	});

	// does not throw

	it('should not throw an error by do not send arguments', function() {
		assert.doesNotThrow(() => {
			validateTemplates();
		});
	});
	it('should not throw an error by an empty value', function() {
		assert.doesNotThrow(() => {
			validateTemplates({ key: {} });
		});
		assert.doesNotThrow(() => {
			validateTemplates({ key1: 'value1', key2: {} });
		});
	});
	it('should not throw an error by an empty value: 2 level', function() {
		assert.doesNotThrow(() => {
			validateTemplates({ branchA: { branchAA: 'value1' }, branchB: { branchBB: {} } });
		});
	});
	it('should not throw an error by an empty object', function() {
		assert.doesNotThrow(() => {
			validateTemplates({});
		});
	});
	it('should not throw an error by correct arguments: key-value pairs: 1 level', function() {
		assert.doesNotThrow(() => {
			validateTemplates({ key1: 'value1' });
		});
	});
	it('should not throw an error by correct arguments: key-value pairs x2: 1 level', function() {
		assert.doesNotThrow(() => {
			validateTemplates({ key1: 'value1', key2: 'value2' });
		});
	});

	it('should not throw an error by correct arguments: key-value pairs: 2 level', function() {
		assert.doesNotThrow(() => {
			validateTemplates({ branchA: { branchAA: 'value1' } });
		});
	});
	it('should not throw an error by correct arguments: key-value pairs x2: 2 level', function() {
		assert.doesNotThrow(() => {
			validateTemplates({ branchA: { branchAA: 'value1' }, branchB: { branchBB: 'value2' } });
		});
	});
});


describe('validateShortcuts() throws', function() {

	// throws

	it('should throw an error by empty arguments', function() {
		assert.throw(() => {
			validateShortcuts();
		});
	});
	it('should throw an error by invalid arguments', function() {
		assert.throw(() => {
			validateShortcuts('nonObject');
		});
		assert.throw(() => {
			validateShortcuts([]);
		});
	});
	it('should throw an error by send an empty object', function() {
		assert.throw(() => {
			validateShortcuts({});
		});
	});
	it('should throw an error by send an empty object: 1 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: {} });
		});
	});
	it('should throw an error by send an empty object: 2 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: {} } });
		});
	});
	it('should throw an error by send an empty object: 3 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: { branchAAA: {} } } });
		});
	});
	it('should throw an error by send an empty object on some branch: 1 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: { branchAAA: 'string' } }, branchB: {} });
		});
	});
	it('should throw an error by invalid arguments: 1 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: [] });
		});
	});
	it('should throw an error by invalid arguments: 2 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: [] } });
		});
	});
	it('should throw an error by invalid arguments: 3 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: { branchAAA: [] } } });
		});
	});
	it('should throw an error by invalid arguments on some branch: 1 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: { branchAAA: 'string' } }, branchB: [] });
		});
	});

	// does not throw:

	it('should not throw an error by correct arguments: key-value pairs: 1 level', function() {
		assert.doesNotThrow(() => {
			validateShortcuts({ branchA: 'isAString' });
		});
	});
	it('should not throw an error by correct arguments: key-value pairs: 2 level', function() {
		assert.doesNotThrow(() => {
			validateShortcuts({ branchA: { branchAA: 'isAString' } });
		});
	});
	it('should not throw an error by correct arguments: key-value pairs: 3 level', function() {
		assert.doesNotThrow(() => {
			validateShortcuts({ branchA: { branchAA: { branchAAA: 'isAString' } } });
		});
	});
	it('should not throw an error by correct arguments: key-value pairs x2: 1 level', function() {
		assert.doesNotThrow(() => {
			validateShortcuts({ branchB: 'isAString', branchA: { branchAA: { branchAAA: 'isAString' } } });
		});
	});
	it('should not throw an error by correct arguments: key-value pairs x2: 2 & 3 level', function() {
		assert.doesNotThrow(() => {
			validateShortcuts({ branchB: { branchB: 'branchB' }, branchA: { branchAA: { branchAAA: 'isAString' } } });
		});
	});

});
