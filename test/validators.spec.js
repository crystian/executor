const { assert, expect } = require('chai');
const { messages } = require('../lib/engine/i18n');
const { validateEnvironments, validateConfig, validateTemplates, validateShortcuts, validateShortcut, validateConfigFileField } = require('../lib/engine/validators');


describe('validateShortcut()', function() {
	let code = messages.errors.shortcut.withoutArguments.code;

	// throws

	it('should throw an error by empty arguments', function() {
		function f() {
			validateShortcut();
		}

		expect(f).to.throw(ExecutorError).has.property('code', code);
		expect(f).to.throw(ExecutorError).has.property('message').not.include('${shortcuts}');

	});
	it('should throw an error by empty arguments and show shortcuts', function() {
		function f() {
			validateShortcut('', 'shortcuts1');
		}

		expect(f).to.throw(ExecutorError).that.has.property('code', code);
		expect(f).to.throw(ExecutorError).that.has.property('message').include('shortcuts1');
	});
	it('should throw an error by invalid arguments', function() {
		expect(() => {

			validateShortcut({});

		}).to.throw(ExecutorError).that.has.property('code', code);

		expect(() => {

			validateShortcut('');

		}).to.throw(ExecutorError).that.has.property('code', code);

		expect(() => {

			validateShortcut([]);

		}).to.throw(ExecutorError).that.has.property('code', code);

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
		let code = messages.errors.config.invalidFormat.code;

		expect(() => {

			validateConfig([]);

		}).to.throw(ExecutorError).that.has.property('code', code);

		expect(() => {

			validateConfig(1);

		}).to.throw(ExecutorError)
			.that.has.property('code', code);

		expect(() => {

			validateConfig(null);

		}).to.throw(ExecutorError)
			.that.has.property('code', code);

		expect(() => {

			validateConfig('');

		}).to.throw(ExecutorError).that.has.property('code', code);
	});

	it('should throw an error by sent unknown field', function() {
		let code = messages.errors.config.isNotAKnownField.code;

		expect(() => {

			validateConfig({ unknown: 'unknown' });

		}).to.throw(ExecutorError).that.has.property('code', code);
	});

	it('should throw an error by sent a reserved field name on templates', function() {
		let code = messages.errors.config.isAReservedField.code;

		expect(() => {

			validateConfig({ templates: { environments: '' } });

		}).to.throw(ExecutorError).that.has.property('code', code);
	});

	it('should throw an error by sent a reserved field name on shortcuts', function() {
		let code = messages.errors.config.isAReservedField.code;

		expect(() => {

			validateConfig({ shortcuts: { environments: '' } });

		}).to.throw(ExecutorError).that.has.property('code', code);
	});

	it('should throw an error by sent a reserved field name on shortcuts without add mention templates, it\'s okey', function() {
		let code = messages.errors.config.isAReservedField.code;

		expect(() => {

			validateConfig({ shortcuts: { environments: '' }, templates: { predefined: '' } });

		}).to.throw(ExecutorError).that.has.property('code', code);
	});

	it('should not throw an error by ', function() {
		assert.doesNotThrow(() => {
			validateConfig({ templates: { template1: 'template1s' } });
		});
	});

	it('should not throw an error by sent known field', function() {
		assert.doesNotThrow(() => {
			validateConfig({ templates: '' });
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


describe('validateTemplates() throws', function() {
	let code1 = messages.errors.templates.invalidData.code;
	let code2 = messages.errors.templates.invalidFormat.code;

	// throws

	it('should throw an error by invalid arguments: 1 level', function() {

		expect(() => {

			validateTemplates([]);

		}).to.throw(ExecutorError).that.has.property('code', code1);

		expect(() => {

			validateTemplates({ key: 1 });

		}).to.throw(ExecutorError).that.has.property('code', code2);

		expect(() => {

			validateTemplates({ key: null });

		}).to.throw(ExecutorError).that.has.property('code', code2);
	});

	it('should throw an error by invalid arguments: 2 level', function() {
		expect(() => {

			validateTemplates({ branchA: { branchAA: [] } });

		}).to.throw(ExecutorError).has.property('code', code2);

		expect(() => {

			validateTemplates({ branchA: { branchAA: 1 } });

		}).to.throw(ExecutorError).that.has.property('code', code2);

		expect(() => {

			validateTemplates({ branchA: { branchAA: null } });

		}).to.throw(ExecutorError).that.has.property('code', code2);
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

	let code1 = messages.errors.shortcuts.notFound.code;
	let code2 = messages.errors.shortcuts.shouldBeAnObject.code;

	it('should throw an error by empty arguments', function() {
		expect(() => {

			validateShortcuts();

		}).to.throw(ExecutorError).that.has.property('code', code1);
	});
	it('should throw an error by send an empty object', function() {
		expect(() => {

			validateShortcuts({});

		}).to.throw(ExecutorError).that.has.property('code', code1);
	});

	it('should throw an error by invalid arguments', function() {
		expect(() => {

			validateShortcuts('nonObject');

		}).to.throw(ExecutorError).that.has.property('code', code1);

		expect(() => {

			validateShortcuts([]);

		}).to.throw(ExecutorError).that.has.property('code', code1);
	});
	it('should throw an error by send an empty object: 1 level', function() {
		expect(() => {

			validateShortcuts({ branchA: {} });

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code2);
	});
	it('should throw an error by send an empty object: 2 level', function() {
		expect(() => {

			validateShortcuts({ branchA: { branchAA: {} } });

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code2);
	});
	it('should throw an error by send an empty object: 3 level', function() {
		expect(() => {

			validateShortcuts({ branchA: { branchAA: { branchAAA: {} } } });

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code2);
	});
	it('should throw an error by send an empty object on some branch: 1 level', function() {
		expect(() => {

			validateShortcuts({ branchA: { branchAA: { branchAAA: 'string' } }, branchB: {} });

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code2);
	});
	it('should throw an error by invalid arguments: 1 level', function() {
		expect(() => {

			validateShortcuts({ branchA: [] });

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code2);
	});
	it('should throw an error by invalid arguments: 2 level', function() {
		expect(() => {

			validateShortcuts({ branchA: { branchAA: [] } });

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code2);
	});
	it('should throw an error by invalid arguments: 3 level', function() {
		expect(() => {

			validateShortcuts({ branchA: { branchAA: { branchAAA: [] } } });

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code2);
	});
	it('should throw an error by invalid arguments on some branch: 1 level', function() {
		expect(() => {

			validateShortcuts({ branchA: { branchAA: { branchAAA: 'string' } }, branchB: [] });

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code2);
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


describe('validateEnvironments() throws', function() {

	// throws

	let code = messages.errors.environments.invalidFormat.code;

	it('should throw an error by invalid arguments', function() {
		expect(() => {

			validateEnvironments({});

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code);

		expect(() => {

			validateEnvironments(1);

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code);

		expect(() => {

			validateEnvironments([1]);

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code);
	});

	it('should throw an error by send an empty object', function() {
		expect(() => {

			validateEnvironments([{ key1: {} }]);

		}).to.throw(ExecutorError).that.has.property('code').that.is.equal(code);
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


describe('validateConfigFileField() throws', function() {
	let code = messages.errors.config.isNotAString.code;

	// throws
	it('should throw an error by invalid arguments', function() {
		expect(() => {

			validateConfigFileField({ executor: { configFile: {} } });

		}).to.throw(ExecutorError).has.property('code', code);

		expect(() => {

			validateConfigFileField({ executor: { configFile: [] } });

		}).to.throw(ExecutorError).that.has.property('code', code);

		expect(() => {

			validateConfigFileField({ executor: { configFile: 1 } });

		}).to.throw(ExecutorError).that.has.property('code', code);

	});

	// does not throw

	it('should return false by empty package.json', function() {
		let r = validateConfigFileField();
		assert.isNotOk(r);
	});
	it('should return false by object empty on package.json', function() {
		let r = validateConfigFileField({});
		assert.isNotOk(r);
	});
	it('should return false by empty executor field', function() {
		let r = validateConfigFileField({ executor: {} });
		assert.isNotOk(r);
	});
	it('should return false by executor field filled with ""', function() {
		let r = validateConfigFileField({ executor: { configFile: '' } });
		assert.isNotOk(r);
	});
	it('should return true by executor field filled', function() {
		let r = validateConfigFileField({ executor: { configFile: 'something' } });
		assert.isOk(r);
	});
});
