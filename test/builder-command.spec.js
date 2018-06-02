const {assert, expect} = require('chai');
const {messages} = require('../lib/i18n');
const {buildCommand, buildCommandWithConfig} = require('../lib/builders');
const path = require('path');


// a little end to end, I know. For that I wrote some random tests

describe('buildCommand() throws', function () {
	let code404 = messages.errors.config.notFound.code;
	let cwd = process.cwd();
	afterEach('', () => {
		process.chdir(cwd);
	});

	// does not throws

	it('should not throw an error by hello world!', function () {
		process.chdir('test/docker/00');

		let r;
		assert.doesNotThrow(() => {
			r = buildCommand('hello');
		});

		assert.isOk(r);
		assert.notEmpty(r);
	});
	it('should not throw an error by hello world! even package.json configured', function () {
		process.chdir('test/docker/11');

		let r = buildCommand('hello');

		assert.isOk(r);
		assert.notEmpty(r);
	});
	it('should not throw an error by hello world! redefined!', function () {
		process.chdir('test/docker/18');

		let r = buildCommand('hello');

		assert.isOk(r);
		assert.notEmpty(r);
		assert.equal(r.command, 'echo from package.json');
	});


	it('should not throw an error, from package.json', function () {
		process.chdir('test/docker/11');

		let r = buildCommand('shortcuts1');

		assert.equal(r.command, 'echo shortcut1s and template1s');
	});

	it('should not throw an error, from executor.json', function () {
		process.chdir('test/docker/12');

		let r = buildCommand('shortcuts1');

		assert.equal(r.command, 'echo shortcut1s and template1s');
	});

	it('should not throw an error, from newExecutor.json', function () {
		process.chdir('test/docker/13');

		let r = buildCommand('shortcuts1');

		assert.equal(r.command, 'echo shortcut1s and template1s');
	});

	it('should not throw an error, from executor.json and package.json', function () {
		process.chdir('test/docker/14');

		let r = buildCommand('shortcuts1');

		assert.equal(r.command, 'echo shortcut1s and template1s');
	});

	it('should not throw an error, from newExecutor.json and package.json', function () {
		process.chdir('test/docker/15');

		let r = buildCommand('shortcuts1');

		assert.equal(r.command, 'echo shortcut1s and template1s');
	});

	it('should not throw an error, from executor.json and package.json inverted', function () {
		process.chdir('test/docker/16');

		let r = buildCommand('shortcuts1');

		assert.equal(r.command, 'echo shortcut1s and template1s');
	});

	it('should not throw an error, from executor.json and package.json inverted', function () {
		process.chdir('test/docker/17');

		let r = buildCommand('shortcuts1');

		assert.equal(r.command, 'echo shortcut1s and template1s');
	});

	xit('should not throw an error, from executor.json and package.json inverted', function () {
		process.chdir('test/docker/19');

		let r = buildCommand('shortcuts1');

		assert.equal(r.command, 'echo shortcut1s and template1s 0.0.0');
	});

	// throws

	it('should throw an error by not config', function () {
		expect(() => {

			buildCommand();

		}).to.throw(ExecutorError).that.has.property('code', code404);
	});

	it('should throw an error by configuration not found, empty folder', function () {
		process.chdir('test/docker/00');

		expect(() => {
			buildCommand();
		}).to.throw(ExecutorError).that.has.property('code', code404);
	});

	it('should throw an error by configuration not found, package.json without config', function () {
		process.chdir('test/docker/01');

		expect(() => {
			buildCommand();
		}).to.throw(ExecutorError).that.has.property('code', code404);

		expect(() => {
			buildCommand('a');
		}).to.throw(ExecutorError).that.has.property('code', code404);
	});

	it('should throw an error by configuration not found on executor.json', function () {
		process.chdir('test/docker/02');

		expect(() => {
			buildCommand();
		}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.notConfigurationOnFile.code);
	});

	it('should throw an error by configuration found on package.json but without arguments', function () {
		process.chdir('test/docker/04');

		expect(() => {
			buildCommand();
		}).to.throw(ExecutorError).that.has.property('code', messages.errors.shortcut.withoutArguments.code);
	});

	it('should throw an error by configuration found on executor.json and package.json but without arguments', function () {
		process.chdir('test/docker/05');

		expect(() => {
			buildCommand();
		}).to.throw(ExecutorError).that.has.property('code', messages.errors.shortcut.withoutArguments.code);
	});

	it('should throw an error by configuration found on executor.json but without arguments', function () {
		process.chdir('test/docker/06');

		expect(() => {
			buildCommand();
		}).to.throw(ExecutorError).that.has.property('code', messages.errors.shortcut.withoutArguments.code);
	});

	it('should throw an error by configuration not found on newExecutor.json', function () {
		process.chdir('test/docker/07');

		expect(() => {
			buildCommand();
		}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.notConfigurationOnFile.code);
	});

	it('should throw an error by configuration found on package.json even with an empty newExecutor.json', function () {
		process.chdir('test/docker/08');

		expect(() => {
			buildCommand();
		}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.notConfigurationOnFile.code);
	});

	it('should throw an error by configuration found on package.json even with an empty executor.json', function () {
		process.chdir('test/docker/09');

		expect(() => {
			buildCommand();
		}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.notConfigurationOnFile.code);
	});

	it('should throw an error by file not found', function () {
		process.chdir('test/docker/10');

		expect(() => {
			buildCommand();
		}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.internalNotFound.code);
	});

	it('should throw an error by invalid shortcut', function () {
		process.chdir('test/docker/11');

		expect(() => {
			buildCommand('shortcutsInvalid');
		}).to.throw(ExecutorError).that.has.property('code', messages.errors.shortcut.notFoundFirstShortcut.code);
	});
});


describe('buildCommandWithConfig()', function () {

	it('should resolve the simple command: 3 level', function () {
		let r = buildCommandWithConfig('branchA branchAA branchAAA', {shortcuts: {branchA: {branchAA: {branchAAA: 'short1s'}}}});
		assert.equal(r.command, 'short1s');
	});
	it('should keep the parameters', function () {
		let r = buildCommandWithConfig('short1 -param1', {shortcuts: {short1: 'short1s'}});
		assert.equal(r.command, 'short1s -param1');
	});
	it('should keep the parameters even internal parameters', function () {
		let r = buildCommandWithConfig('short1 -param1', {shortcuts: {short1: 'short1s -internalArg'}});
		assert.equal(r.command, 'short1s -internalArg -param1');
	});
	it('should keep the parameters: 2 branches', function () {
		let r = buildCommandWithConfig('short2 -param1', {
			shortcuts: {
				short1: 'short1s -internalArg',
				short2: 'short2s -internalArg'
			}
		});
		assert.equal(r.command, 'short2s -internalArg -param1');
	});
	it('should interpolate with a template and keep the parameters', function () {
		let r = buildCommandWithConfig('short1 -param1', {
			templates: {
				template1: 'template1s'
			},
			shortcuts: {
				short1: '${template1} -internalArg'
			}
		});
		assert.equal(r.command, 'template1s -internalArg -param1');
	});
	it('should interpolate with a template and keep the parameters: 2 branches', function () {
		let r = buildCommandWithConfig('short1 -param1', {
			templates: {
				template1: 'template1s',
				template2: 'template2s'
			},
			shortcuts: {
				short1: '${template1}-${template2} -internalArg'
			}
		});
		assert.equal(r.command, 'template1s-template2s -internalArg -param1');
	});
	it('should interpolate with a template and keep the parameters: 2 branches, 1 nested template', function () {
		let r = buildCommandWithConfig('short1 -param1', {
			templates: {
				template1: 'template1s',
				template2: 'template2s including ${template1}'
			},
			shortcuts: {
				short1: '${template1}-${template2} -internalArg'
			}
		});
		assert.equal(r.command, 'template1s-template2s including template1s -internalArg -param1');
	});
	it('should interpolate with a template and keep the parameters: 2 branches, 2 nested template/shortcut', function () {
		let r = buildCommandWithConfig('short2 -param1', {
			templates: {
				template1: 'template1s',
				template2: 'template2s including ${template1}'
			},
			shortcuts: {
				short1: '${template1}-${template2} -internalArg',
				short2: '${short1} and short2 nested'
			}
		});
		assert.equal(r.command, 'template1s-template2s including template1s -internalArg and short2 nested -param1');
	});
	it('should interpolate with a template and keep the parameters: 3 branches, 3 nested template/shortcut, 3 levels', function () {
		let r = buildCommandWithConfig('short2 -param1', {
			templates: {
				branchA: 'branchAs',
				branchB: {
					branchBB: {
						branchBBB: 'branchBBBs'
					}
				},
				branchC: '${branchA} and1 ${branchB.branchBB.branchBBB}'
			},
			shortcuts: {
				short1: '${branchC} and2 ${branchA}',
				short2: '${short1} and3 ${branchB.branchBB.branchBBB} --internalArg'
			}
		});
		assert.equal(r.command, 'branchAs and1 branchBBBs and2 branchAs and3 branchBBBs --internalArg -param1');
	});

	it('should interpolate predefine value: cwd', function () {
		let r = buildCommandWithConfig('short1', {
			templates: {
				branchA: 'branchAs ${def.cwd}'
			},
			shortcuts: {
				short1: '${branchA} and ${def.cwd}'
			}
		});
		let cwd = path.resolve(process.cwd());
		assert.equal(r.command, `branchAs ${cwd} and ${cwd}`);
	});
	it('should interpolate environment variable', function () {
		process.env['EXECUTORTEST3'] = 'works3!';

		let r = buildCommandWithConfig('short1', {
			templates: {
				branchA: 'branchAs ${env.EXECUTORTEST3}'
			},
			shortcuts: {
				short1: '${branchA}s'
			}
		});

		assert.equal(r.command, 'branchAs works3!s');
	});
	it('should interpolate environment variable', function () {
		process.env['EXECUTORTEST3'] = 'works3!';

		let r = buildCommandWithConfig('short1', {
			templates: {
				branchA: 'branchAs ${env.EXECUTORTEST3}'
			},
			shortcuts: {
				short1: '${branchA}s'
			}
		});

		assert.equal(r.command, 'branchAs works3!s');
	});
	it('should throw an error by interpolate environment variable not found', function () {

		expect(() => {

			buildCommandWithConfig('short1', {
				templates: {
					branchA: 'branchAs ${env.NOT_FOUND}'
				},
				shortcuts: {
					short1: '${branchA}s'
				}
			});

		}).to.throw(ExecutorError).that.has.property('code', messages.errors.templates.notFound.code);
	});
});
