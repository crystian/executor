const { assert, expect } = require('chai');
const { messages } = require('../lib/i18n');
const { buildCommand, buildCommandWithConfig } = require('../lib/builders');
const path = require('path');

// environment!
// predefined

// a little end to end, I know. For that I wrote some random tests

describe('buildCommand() throws', function() {

	// throws

	it('should throw an error by invalid arguments', function() {
		let code1 = messages.errors.shortcut.withoutArguments.code;

		expect(() => {

			buildCommand();

		}).to.throw(ExecutorError).that.has.property('code', code1);
	});
});

describe('buildCommandWithConfig()', function() {

	it('should resolve the simple command: 3 level', function() {
		let r = buildCommandWithConfig('branchA branchAA branchAAA', { shortcuts: { branchA: { branchAA: { branchAAA: 'short1s' } } } });
		assert.equal(r.command, 'short1s');
	});
	it('should keep the parameters', function() {
		let r = buildCommandWithConfig('short1 -param1', { shortcuts: { short1: 'short1s' } });
		assert.equal(r.command, 'short1s -param1');
	});
	it('should keep the parameters even internal parameters', function() {
		let r = buildCommandWithConfig('short1 -param1', { shortcuts: { short1: 'short1s -internalArg' } });
		assert.equal(r.command, 'short1s -internalArg -param1');
	});
	it('should keep the parameters: 2 branches', function() {
		let r = buildCommandWithConfig('short2 -param1', {
			shortcuts: {
				short1: 'short1s -internalArg',
				short2: 'short2s -internalArg'
			}
		});
		assert.equal(r.command, 'short2s -internalArg -param1');
	});
	it('should interpolate with a template and keep the parameters', function() {
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
	it('should interpolate with a template and keep the parameters: 2 branches', function() {
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
	it('should interpolate with a template and keep the parameters: 2 branches, 1 nested template', function() {
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
	it('should interpolate with a template and keep the parameters: 2 branches, 2 nested template/shortcut', function() {
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
	it('should interpolate with a template and keep the parameters: 3 branches, 3 nested template/shortcut, 3 levels', function() {
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

	it('should interpolate predefine value: cwd', function() {
		let r = buildCommandWithConfig('short1', {
			templates: {
				branchA: 'branchAs ${predefined.cwd}'
			},
			shortcuts: {
				short1: '${branchA} and ${predefined.cwd}'
			}
		});
		let cwd = path.resolve(process.cwd());
		assert.equal(r.command, `branchAs ${cwd} and ${cwd}`);
	});
	it('should interpolate environment variable: cwd', function() {
		process.env['EXECUTOR-TEST2'] = 'works2!';
		process.env['EXECUTORTEST3'] = 'works3!';

		let r = buildCommandWithConfig('short1', {
			environments: [
				'EXECUTORTEST3',
				{ otherVarWithKey: 'EXECUTOR-TEST2' }
			],
			templates: {
				branchA: 'branchAs ${environments.EXECUTORTEST3} and ${environments.otherVarWithKey}'
			},
			shortcuts: {
				short1: '${branchA} and ${predefined.cwd}'
			}
		});

		let cwd = path.resolve(process.cwd());
		assert.equal(r.command, `branchAs works3! and works2! and ${cwd}`);
	});
});
