const { assert } = require('chai');
const { messages } = require('../lib/i18n');
const { validateAndBuildEnvironments, validateConfig, validateTemplates, validateShortcuts, validateShortcut } = require('../lib/validators');


describe('validateShortcut() throws', function() {
	// throws

	it('should throw an error by empty arguments', function() {
		let re = new RegExp(messages.shortcut.withoutArguments);

		assert.throw(() => {
			validateShortcut();
		}, re);
	});
	it('should throw an error by invalid arguments', function() {
		let re = new RegExp(messages.shortcut.withoutArguments);
		assert.throw(() => {
			validateShortcut({});
		}, re);
		assert.throw(() => {
			validateShortcut('');
		}, re);
		assert.throw(() => {
			validateShortcut([]);
		}, re);
	});

	// does not throw

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
		let re = new RegExp(messages.config.invalidFormat);

		assert.throw(() => {
			validateConfig([]);
		}, re);
		assert.throw(() => {
			validateConfig(1);
		}, re);
		assert.throw(() => {
			validateConfig(null);
		}, re);
		assert.throw(() => {
			validateConfig('');
		}, re);
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
	let re = new RegExp(messages.environments.invalidFormat
		.replace('(', '\\(')
		.replace(')','\\)'));

	it('should throw an error by invalid arguments', function() {
		assert.throw(() => {
			validateAndBuildEnvironments({});
		}, re);
		assert.throw(() => {
			validateAndBuildEnvironments(1);
		}, re);
		assert.throw(() => {
			validateAndBuildEnvironments([1]);
		}, re);
	});

	it('should throw an error by send an empty object', function() {
		assert.throw(() => {
			validateAndBuildEnvironments([{ key1: {} }]);
		}, re);
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
		let re = new RegExp(messages.templates.invalidData);
		let re2 = new RegExp(messages.templates.invalidFormat.toTemplate({key: 'key'})
			.replace('(', '\\(')
			.replace(')','\\)'));

		assert.throw(() => {
			validateTemplates([]);
		}, re);
		assert.throw(() => {
			validateTemplates({ key: 1 });
		}, re2);
		assert.throw(() => {
			validateTemplates({ key: null });
		}, re2);
	});

	it('should throw an error by invalid arguments: 2 level', function() {
		let re = new RegExp(messages.templates.invalidFormat.toTemplate({key: 'branchAA'})
			.replace('(', '\\(')
			.replace(')','\\)'));

		assert.throw(() => {
			validateTemplates({ branchA: { branchAA: [] } });
		}, re);
		assert.throw(() => {
			validateTemplates({ branchA: { branchAA: 1 } });
		}, re);
		assert.throw(() => {
			validateTemplates({ branchA: { branchAA: null } });
		}, re);
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
	let re = new RegExp(messages.shortcuts.notFound);
	let re2 = new RegExp(messages.shortcuts.shouldBeAnObject);

	it('should throw an error by empty arguments', function() {
		assert.throw(() => {
			validateShortcuts();
		}, re);
	});

	it('should throw an error by invalid arguments', function() {
		assert.throw(() => {
			validateShortcuts('nonObject');
		}, re);
		assert.throw(() => {
			validateShortcuts([]);
		}, re);
	});
	it('should throw an error by send an empty object', function() {
		assert.throw(() => {
			validateShortcuts({});
		}, re);
	});
	it('should throw an error by send an empty object: 1 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: {} });
		}, re2);
	});
	it('should throw an error by send an empty object: 2 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: {} } });
		}, re2);
	});
	it('should throw an error by send an empty object: 3 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: { branchAAA: {} } } });
		}, re2);
	});
	it('should throw an error by send an empty object on some branch: 1 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: { branchAAA: 'string' } }, branchB: {} });
		}, re2);
	});
	it('should throw an error by invalid arguments: 1 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: [] });
		}, re2);
	});
	it('should throw an error by invalid arguments: 2 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: [] } });
		}, re2);
	});
	it('should throw an error by invalid arguments: 3 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: { branchAAA: [] } } });
		}, re2);
	});
	it('should throw an error by invalid arguments on some branch: 1 level', function() {
		assert.throw(() => {
			validateShortcuts({ branchA: { branchAA: { branchAAA: 'string' } }, branchB: [] });
		}, re2);
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
