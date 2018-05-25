const { assert } = require('chai');
const { messages } = require('../i18n');
const { validateEnvironments, validateConfig, validateTemplates, validateShortcuts, validateShortcut } = require('./validators');

// function sanityRegExp(s) {
// 	console.log('s', s);
// 	return s.replaceAll('\\(', '(')
// 	// .replaceAll('/\\?', '?')
// 	.replaceAll('$', '\\$')
// 		// .replaceAll('\\"', '"')
// 		;
// }

describe('validateShortcut() throws', function() {
	let re = messages.shortcut.withoutArguments;
	// throws

	it('should throw an error by empty arguments', function() {

		assert.throw(() => {
			validateShortcut();
		}, re);
	});
	it('should throw an error by empty arguments and show extraMessage', function() {
		assert.throw(() => {
			validateShortcut('', 'extraMessage1');
		}, re + 'extraMessage1');
	});
	it('should throw an error by invalid arguments', function() {
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
		let re = messages.config.invalidFormat;

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


describe('validateTemplates() throws', function() {

	// throws

	it('should throw an error by invalid arguments: 1 level', function() {
		let re = messages.templates.invalidData;
		let re2 = messages.templates.invalidFormat.toTemplate({ key: 'key' });

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
		let re = messages.templates.invalidFormat.toTemplate({ key: 'branchAA' });

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

	let re = messages.shortcuts.notFound;
	let re2 = messages.shortcuts.shouldBeAnObject;

	it('should throw an error by empty arguments', function() {
		assert.throw(() => {
			validateShortcuts();
		}, re);
	});
	it('should throw an error by send an empty object', function() {
		assert.throw(() => {
			validateShortcuts({});
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


describe('validateAndBuildEnvironments() throws', function() {

	// throws

	let re = messages.environments.invalidFormat;

	it('should throw an error by invalid arguments', function() {
		assert.throw(() => {
			validateEnvironments({});
		}, re);
		assert.throw(() => {
			validateEnvironments(1);
		}, re);
		assert.throw(() => {
			validateEnvironments([1]);
		}, re);
	});

	it('should throw an error by send an empty object', function() {
		assert.throw(() => {
			validateEnvironments([{ key1: {} }]);
		}, re);
	});

	// does not throw

	it('should not throw an error by do not send arguments', function() {
		assert.doesNotThrow(() => {
			validateEnvironments();
		});
	});
	it('should not throw an error by send empty string', function() {
		assert.doesNotThrow(() => {
			validateEnvironments('');
		});
	});
	it('should not throw an error by send a null', function() {
		assert.doesNotThrow(() => {
			validateEnvironments(null);
		});
		assert.doesNotThrow(() => {
			validateEnvironments([null]);
		});
	});
	it('should not throw an error by send an empty array', function() {
		assert.doesNotThrow(() => {
			validateEnvironments([]);
		});
	});
	it('should not throw an error by correct arguments: string', function() {
		assert.doesNotThrow(() => {
			validateEnvironments(['env1']);
		});
	});
	it('should not throw an error by correct arguments: object', function() {
		assert.doesNotThrow(() => {
			validateEnvironments([{ key1: 'value1' }]);
		});
	});
	it('should not throw an error by correct arguments: object and string', function() {
		assert.doesNotThrow(() => {
			validateEnvironments([{ key1: 'value1' }, 'key2']);
		});
	});

});




