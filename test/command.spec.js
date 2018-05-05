const { assert } = require('chai');
const { buildCommand, buildCommandWithConfig } = require('../lib/builders');
const path = require('path');

// a little end to end, I know. For that I wrote some random tests

describe('buildCommand() throws', function() {

	// throws

	it('should throw an error by invalid arguments', function() {
		assert.throw(() => {
			buildCommand();
		});
		assert.throw(() => {
			buildCommand('');
		});
	});
});

describe('buildCommandWithConfig() throws', function() {

	// throws

	it('should throw an error by invalid arguments', function() {
		assert.throw(() => {
			buildCommandWithConfig();
		});
		assert.throw(() => {
			buildCommandWithConfig('');
		});
		assert.throw(() => {
			buildCommandWithConfig('', {});
		});
	});

	it('should throw an error by it does not have match: 1 level', function() {
		assert.throw(() => {
			buildCommandWithConfig('short2', { shortcuts: { short1: 'short1s' } });
		});
	});
});

describe('buildCommandWithConfig() results', function() {

	it('should resolve the simple command: 1 level', function() {
		let r = buildCommandWithConfig('short1', { shortcuts: { short1: 'short1s' } });
		assert.equal(r.command, 'short1s');
	});
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
		let cwd = path.resolve(process.cwd(), 'lib');
		assert.equal(r.command, `branchAs ${cwd} and ${cwd}`);
	});
	it('should interpolate environment variable: cwd', function() {
		let r = buildCommandWithConfig('short1', {
			config: {
				environments: [
					'cwd'
				]
			},
			templates: {
				branchA: 'branchAs ${predefined.cwd}'
			},
			shortcuts: {
				short1: '${branchA} and ${predefined.cwd}'
			}
		});
		let cwd = path.resolve(process.cwd(), 'lib');
		assert.equal(r.command, `branchAs ${cwd} and ${cwd}`);
	});
});

describe('buildCommandWithConfig() show results to user', function() {
	it('should show result: dry: true, showCommand: true', function() {
		let r = buildCommandWithConfig('short1', {
			shortcuts: { short1: 'short1s' },
			config: {
				showCommand: true,
				dry: true
			}
		});
		assert.isOk(r.test.showedCommand);
		assert.isOk(r.test.dry);
	});
	it('should show result: dry: true, showCommand: false', function() {
		let r = buildCommandWithConfig('short1', {
			shortcuts: { short1: 'short1s' },
			config: {
				showCommand: false,
				dry: true
			}
		});
		assert.isOk(r.test.showedCommand);
		assert.isOk(r.test.dry);
	});
	it('should show result: dry: false, showCommand: true', function() {
		let r = buildCommandWithConfig('short1', {
			shortcuts: { short1: 'short1s' },
			config: {
				showCommand: true,
				dry: false
			}
		});
		assert.isOk(r.test.showedCommand);
		assert.isNotOk(r.test.dry);
	});
	it('should not show result: dry: false, showCommand: false', function() {
		let r = buildCommandWithConfig('short1', {
			shortcuts: { short1: 'short1s' },
			config: {
				showCommand: false,
				dry: false
			}
		});
		assert.isNotOk(r.test.showedCommand);
		assert.isNotOk(r.test.dry);
	});
});

describe('buildCommandWithConfig() with environment results', function() {
	before(function() {
		process.env['EXECUTOR-TEST1'] = 'works1!';
		process.env['EXECUTOR-TEST2'] = 'works2!';
		process.env['EXECUTOR-TEST3'] = 'works3!';
	});

	it('should interpolate with environment variable on template', function() {
		let templates = { template1: 'template1s ${EXECUTOR-TEST1}' };
		let shortcuts = { key1: '${template1} value1' };
		let environments = ['EXECUTOR-TEST1'];
		let config = { templates, shortcuts, environments };

		let r = buildCommandWithConfig('key1', config);

		assert.equal(r.command, 'template1s works1! value1');
	});

	it('should interpolate with environment variable on shortcut', function() {
		let templates = { template1: 'template1s' };
		let shortcuts = { key1: '${template1} ${EXECUTOR-TEST1} value1' };
		let environments = ['EXECUTOR-TEST1'];
		let config = { templates, shortcuts, environments };

		let r = buildCommandWithConfig('key1', config);

		assert.equal(r.command, 'template1s works1! value1');
	});

	it('should interpolate with environment variable on shortcut and template', function() {
		let templates = { template1: 'template1s ${EXECUTOR-TEST1}' };
		let shortcuts = { key1: '${template1} ${EXECUTOR-TEST2} value1' };
		let environments = ['EXECUTOR-TEST1', 'EXECUTOR-TEST2'];
		let config = { templates, shortcuts, environments };

		let r = buildCommandWithConfig('key1', config);

		assert.equal(r.command, 'template1s works1! works2! value1');
	});

	it('should interpolate with environment variable on shortcut and template with multiples sources and nested', function() {
		let templates = { template1: 'template1s ${otherName1}' };
		let shortcuts = { key1: '${template1} ${otherName2} ${EXECUTOR-TEST3} value1' };
		let environments = [{ otherName1: 'EXECUTOR-TEST1' }, { otherName2: 'EXECUTOR-TEST2' }, 'EXECUTOR-TEST3'];
		let config = { templates, shortcuts, environments };

		let r = buildCommandWithConfig('key1', config);

		assert.equal(r.command, 'template1s works1! works2! works3! value1');
	});

});
