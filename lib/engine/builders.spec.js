const { assert, expect } = require('chai');
const { messages } = require('./i18n');
const { buildShortcutsAvailable, buildConfig, buildEnvironments, buildShortcutCommand, resolveShowCommandOnConsole, buildInterpolateEnvironmentVars } = require('./builders');


describe('buildShortcutsAvailable() results', function() {
	it('should return a string without shortcuts', () => {
		let r = buildShortcutsAvailable();
		assert.equal(r, '');
	});
	it('should return a string without shortcuts', () => {
		let r = buildShortcutsAvailable({});
		assert.equal(r, '');
	});
	it('should return a string without shortcuts', () => {
		let r = buildShortcutsAvailable(1);
		assert.equal(r, '');
	});
	it('should return a string without shortcuts', () => {
		let r = buildShortcutsAvailable([]);
		assert.equal(r, '');
	});

	it('should return a string with a shortcuts', () => {
		let r = buildShortcutsAvailable({ key1: 'key1' });
		assert.include(r, '"key1"');
	});
	it('should return a string with two shortcuts', () => {
		let r = buildShortcutsAvailable({ key1: 'key1', key2: 'key2' });
		assert.include(r, '"key1"');
		assert.include(r, '"key2"');
	});
});


describe('buildConfig()', function() {
	it('should get the config via package only', function() {

		let r = buildConfig({
			packageJson: {
				executor: {
					templates: {
						template1: 'template1s',
						template2: 'template2s'
					}
				}
			}
		});

		assert.deepEqual(r, {
			'templates': {
				'template1': 'template1s',
				'template2': 'template2s'
			}
		});
	});

	it('should get the config via package and executor.json', function() {

		let r = buildConfig({
			packageJson: {
				executor: {
					templates: {
						template1: 'template1s',
						template2: 'template2s'
					}
				}
			},
			executorFile: {
				templates: {
					template2: 'template2b',
					template3: 'template3s'
				}
			}
		});

		assert.deepEqual(r, {
			'templates': {
				'template1': 'template1s',
				'template2': 'template2b',
				'template3': 'template3s'
			}
		});
	});

	it('should get the config via package and configFile without executor.json', function() {

		let r = buildConfig({
			packageJson: {
				executor: {
					templates: {
						template1: 'template1s',
						template2: 'template2s'
					}
				}
			},
			configFile: {
				templates: {
					template2: 'template2c',
					template3: 'template3s'
				}
			},
			executorFile: {
				templates: {
					template1: 'template1b',
					template2: 'template2b',
					template3: 'template3s'
				}
			}
		});

		assert.deepEqual(r, {
			'templates': {
				'template1': 'template1s', //yes! without executor file!
				'template2': 'template2c',
				'template3': 'template3s'
			}
		});
	});

	it('should get the config by executor.json only', function() {
		let r = buildConfig({
			packageJson: null,
			configFile: {
				templates: {
					template2: 'template2c',
					template3: 'template3s'
				}
			},
			executorFile: {
				templates: {
					template1: 'template1b',
					template2: 'template2b',
					template3: 'template3s'
				}
			}
		});

		assert.deepEqual(r, {
			'templates': {
				'template1': 'template1b',
				'template2': 'template2b',
				'template3': 'template3s'
			}
		});
	});

	it('should get empty by does not exist package and executor.json', function() {
		let r = buildConfig({
			packageJson: null,
			configFile: {
				templates: {
					template2: 'template2c',
					template3: 'template3s'
				}
			},
			executorFile: null
		});

		assert.empty(r);
	});
});


describe('validateAndBuildEnvironments() results', function() {
	it('should resolve the object', function() {
		let r = buildEnvironments([{ key1: 'value1' }]);
		assert.deepEqual(r, [{ key1: 'value1' }]);
	});
	it('should resolve the string', function() {
		let r = buildEnvironments(['key1']);
		assert.deepEqual(r, [{ key1: 'key1' }]);
	});
	it('should resolve the object x2', function() {
		let r = buildEnvironments(['key1', 'key2']);
		assert.deepEqual(r, [{ key1: 'key1' }, { key2: 'key2' }]);
	});
	it('should resolve the object and string', function() {
		let r = buildEnvironments([{ key1: 'value1' }, 'key2']);
		assert.deepEqual(r, [{ key1: 'value1' }, { key2: 'key2' }]);
	});
	it('should resolve the string and object', function() {
		let r = buildEnvironments(['key1', { key2: 'value2' }]);
		assert.deepEqual(r, [{ key1: 'key1' }, { key2: 'value2' }]);
	});
	it('should resolve empty arguments', function() {
		let r = buildEnvironments();
		assert.empty(r);
	});
});


describe('buildShortcutCommand()', function() {
	let code1 = messages.errors.shortcut.notFoundFirstShortcut.code;
	let code2 = messages.errors.shortcut.notFound.code;
	let code3 = messages.errors.shortcut.withoutNextArgument.code;

	// throws

	it('should throw an error by it does not have match: 1 level', function() {

		expect(() => {

			buildShortcutCommand({ branchA: 'branchAs' }, 'nonBranchA');

		}).to.throw(ExecutorError).that.has.property('code', code1);

	});
	it('should throw an error by it does not have match: 2 branches, 1 level', function() {
		expect(() => {

			buildShortcutCommand({ branchA: 'branchAs', branchB: 'branchBs' }, 'nonBranchB');

		}).to.throw(ExecutorError).that.has.property('code', code1);
	});
	it('should throw an error by it does not have match: 2 branches, 2 level', function() {
		expect(() => {

			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' }, branchB: { branchBB: 'branchBBs' } }, 'branchA nonBranchAA');

		}).to.throw(ExecutorError).that.has.property('code', code2);
	});
	it('should throw an error by it does not have match: 2 branches, 3 level', function() {
		expect(() => {

			buildShortcutCommand({
				branchA: { branchAA: { branchAAA: 'branchAAAs' } },
				branchB: { branchBB: { branchBBB: 'branchBBBs' } }
			}, 'branchA branchAA nonBranchAAA');

		}).to.throw(ExecutorError).that.has.property('code', code2);
	});
	it('should throw an error by it does not have match even if the match is in other level: 2 level', function() {
		expect(() => {

			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' } }, 'branchA');

		}).to.throw(ExecutorError).that.has.property('code', code3);
	});
});


describe('buildShortcutCommand() results', function() {

	// 1 level

	it('should return the match of the shortcut: 1 level', function() {
		let r = buildShortcutCommand({ branchA: 'branchAs' }, 'branchA');
		assert.lengthOf(r, 1);
		assert.sameMembers(r, ['branchAs']);
	});
	it('should return the match of the shortcut: 2 level', function() {
		let r = buildShortcutCommand({ branchA: { branchAA: 'branchAAs' } }, 'branchA branchAA');
		assert.lengthOf(r, 1);
		assert.sameMembers(r, ['branchAAs']);
	});
	it('should return the match of the shortcut: 3 level', function() {
		let r = buildShortcutCommand({ branchA: { branchAA: { branchAAA: 'branchAAAs' } } }, 'branchA branchAA branchAAA');
		assert.lengthOf(r, 1);
		assert.sameMembers(r, ['branchAAAs']);
	});

	// 2 branches

	it('should return the match of the shortcut: 2 branches, 1 level', function() {
		let r = buildShortcutCommand({ branchA: 'branchAs', branchB: 'branchBs' }, 'branchB');
		assert.lengthOf(r, 1);
		assert.sameMembers(r, ['branchBs']);
	});
	it('should return the match of the shortcut: 2 branches, 2 level', function() {
		let r = buildShortcutCommand({
			branchA: { branchAA: 'branchAAs' },
			branchB: { branchBB: 'branchBBs' }
		}, 'branchB branchBB');
		assert.lengthOf(r, 1);
		assert.sameMembers(r, ['branchBBs']);
	});

	it('should return the match of the shortcut: 2 branches, 3 level', function() {
		let r = buildShortcutCommand({
			branchA: { branchAA: { branchAAA: 'branchAAAs' } },
			branchB: { branchBB: { branchBBB: 'branchBBBs' } }
		}, 'branchB branchBB branchBBB');

		assert.lengthOf(r, 1);
		assert.sameMembers(r, ['branchBBBs']);
	});
	it('should return the match of the shortcut: 2 branches, 2 sub-branches, 3 level', function() {
		let r = buildShortcutCommand({
			branchA: {
				branchAA: { branchAAA: 'branchAAAs' }
			},
			branchB: {
				branchBA: { branchBAA: 'branchBAAs' },
				branchBB: { branchBBA: 'branchBBAs' }
			}
		}, 'branchB branchBB branchBBA');
		assert.lengthOf(r, 1);
		assert.sameMembers(r, ['branchBBAs']);
	});
});


describe('resolveShowCommandOnConsole() show results to user', function() {
	it('should show result: dry: true, showCommand: true', function() {
		let r = resolveShowCommandOnConsole({
			shortcuts: { short1: 'short1s' },
			config: {
				showCommand: true,
				dry: true
			}
		}, 'short1');
		assert.isOk(r.showedCommand);
		assert.isOk(r.dry);
	});
	it('should show result: dry: true, showCommand: false', function() {
		let r = resolveShowCommandOnConsole({
			shortcuts: { short1: 'short1s' },
			config: {
				showCommand: false,
				dry: true
			}
		}, 'short1');
		assert.isOk(r.showedCommand);
		assert.isOk(r.dry);
	});
	it('should show result: dry: false, showCommand: true', function() {
		let r = resolveShowCommandOnConsole({
			shortcuts: { short1: 'short1s' },
			config: {
				showCommand: true,
				dry: false
			}
		}, 'short1');
		assert.isOk(r.showedCommand);
		assert.isNotOk(r.dry);
	});
	it('should not show result: dry: false, showCommand: false', function() {
		let r = resolveShowCommandOnConsole({
			shortcuts: { short1: 'short1s' },
			config: {
				showCommand: false,
				dry: false
			}
		}, 'short1');
		assert.isNotOk(r.showedCommand);
		assert.isNotOk(r.dry);
	});
});


describe('buildInterpolateEnvironmentVars() with environment results', function() {
	before(function() {
		process.env['EXECUTOR-TEST1'] = 'works1!';
	});

	it('should build with environment variable', function() {
		let r = buildInterpolateEnvironmentVars([{key1: 'EXECUTOR-TEST1'}]);

		assert.deepEqual(r, {key1: 'works1!'});
	});
});
