const { assert } = require('chai');
// const { messages } = require('./i18n');
const { buildShortcutsAvailable } = require('./builders');


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


// describe('buildConfig()', function() {
// 	it('should get the config via package only', function() {
//
// 		let r = buildConfig();
//
// 		assert.deepEqual(r, {
// 			'templates': {
// 				'template1': 'template1s',
// 				'template2': 'template2s'
// 			}
// 		});
// 	});
// 	it('should get the config via package and executor.json', function() {
//
// 		let r = buildConfig();
//
// 		assert.deepEqual(r, {
// 			'templates': {
// 				'template1': 'template1s',
// 				'template2': 'template2b',
// 				'template3': 'template3s'
// 			}
// 		});
// 	});
// 	it('should get the config via package and configFile without executor.json', function() {
//
// 		let r = buildConfig();
//
// 		assert.deepEqual(r, {
// 			'templates': {
// 				'template1': 'template1s',
// 				'template2': 'template2c',
// 				'template3': 'template3s'
// 			}
// 		});
// 	});
//
// 	it('should get the config via package without config and configFile without executor.json', function() {
// 		process.chdir('test/fixture/07');
//
// 		let r = buildConfig();
//
// 		assert.deepEqual(r, {
// 			'templates': {
// 				'template2': 'template2c',
// 				'template3': 'template3s'
// 			}
// 		});
// 	});
//
//
// 	it('should get the config via executor.json only (with package.json)', function() {
// 		process.chdir('test/fixture/10');
//
// 		let r = buildConfig();
//
// 		assert.deepEqual(r, {
// 			'templates': {
// 				'template1': 'template1b',
// 				'template2': 'template2b',
// 				'template3': 'template3s'
// 			}
// 		});
// 	});
//
// 	it('should get the config via executor.json only (without package.json)', function() {
// 		process.chdir('test/fixture/11');
//
// 		let r = buildConfig();
//
// 		assert.deepEqual(r, {
// 			'templates': {
// 				'template1': 'template1b',
// 				'template2': 'template2b',
// 				'template3': 'template3s'
// 			}
// 		});
// 	});

// });
// describe('buildConfig() results', function() {
// 	it('should merge deep object adding a new property', function() {
// 		let r = buildConfig({ key1: { subKey1: 'subvalue1' } }, { key1: { subKey2: 'subvalue2' } });
//
// 		assert.hasAllKeys(r, ['key1']);
// 		assert.deepNestedPropertyVal(r, 'key1.subKey1', 'subvalue1');
// 		assert.deepNestedPropertyVal(r, 'key1.subKey2', 'subvalue2');
// 	});
// });


// describe('buildShortcutCommand() throws', function() {
//
// 	// throws
//
// 	it('should throw an error by it does not have match: 1 level', function() {
// 		let re = new RegExp(messages.shortcut.notFoundFirstShortcut.toTemplate({ shortcut: 'nonBranchA' }));
// 		assert.throw(() => {
// 			buildShortcutCommand({ branchA: 'branchAs' }, 'nonBranchA');
// 		}, re);
// 	});
// 	it('should throw an error by it does not have match: 2 branches, 1 level', function() {
// 		let re = new RegExp(messages.shortcut.notFoundFirstShortcut.toTemplate({ shortcut: 'nonBranchB' }));
// 		assert.throw(() => {
// 			buildShortcutCommand({ branchA: 'branchAs', branchB: 'branchBs' }, 'nonBranchB');
// 		}, re);
// 	});
// 	it('should throw an error by it does not have match: 2 branches, 2 level', function() {
// 		let re = new RegExp(messages.shortcut.notFound.toTemplate({ key: 'branchA', subKey: 'nonBranchAA' }));
// 		assert.throw(() => {
// 			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' }, branchB: { branchBB: 'branchBBs' } }, 'branchA nonBranchAA');
// 		}, re);
// 	});
// 	it('should throw an error by it does not have match: 2 branches, 3 level', function() {
// 		let re = new RegExp(messages.shortcut.notFound.toTemplate({ key: 'branchAA', subKey: 'nonBranchAAA' }));
// 		assert.throw(() => {
// 			buildShortcutCommand({
// 				branchA: { branchAA: { branchAAA: 'branchAAAs' } },
// 				branchB: { branchBB: { branchBBB: 'branchBBBs' } }
// 			}, 'branchA branchAA nonBranchAAA');
// 		}, re);
// 	});
// 	it('should throw an error by it does not have match even if the match is in other level: 2 level', function() {
// 		let re = new RegExp(messages.shortcut.withoutNextArgument.toTemplate({ key: 'branchA' }));
// 		assert.throw(() => {
// 			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' } }, 'branchA');
// 		}, re);
// 	});
//
// 	// does not throw
//
// 	it('should not throw an error by correct arguments: 1 level', function() {
// 		assert.doesNotThrow(() => {
// 			buildShortcutCommand({ branchA: 'branchAs' }, 'branchA');
// 		});
// 	});
// 	it('should not throw an error by correct arguments: 2 branches, 1 level', function() {
// 		assert.doesNotThrow(() => {
// 			buildShortcutCommand({ branchA: 'branchAs', branchB: 'branchBs' }, 'branchB');
// 		});
// 	});
// 	it('should not throw an error by correct arguments: 2 branches, 1 & 2 level', function() {
// 		assert.doesNotThrow(() => {
// 			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' }, branchB: 'branchBs' }, 'branchA branchAA');
// 		});
// 	});
// 	it('should not throw an error by correct arguments: 2 branches, 1 & 3 level', function() {
// 		assert.doesNotThrow(() => {
// 			buildShortcutCommand({ branchA: { branchAA: { branchAAA: 'branchAAAs' } }, branchB: 'branchBs' }, 'branchA branchAA branchAAA');
// 		});
// 	});
//
//
// });
//
//
// describe('buildShortcutCommand() results', function() {
//
// 	// 1 level
//
// 	it('should return the match of the shortcut: 1 level', function() {
// 		let r = buildShortcutCommand({ branchA: 'branchAs' }, 'branchA');
// 		assert.lengthOf(r, 1);
// 		assert.sameMembers(r, ['branchAs']);
// 	});
// 	it('should return the match of the shortcut: 2 level', function() {
// 		let r = buildShortcutCommand({ branchA: { branchAA: 'branchAAs' } }, 'branchA branchAA');
// 		assert.lengthOf(r, 1);
// 		assert.sameMembers(r, ['branchAAs']);
// 	});
// 	it('should return the match of the shortcut: 3 level', function() {
// 		let r = buildShortcutCommand({ branchA: { branchAA: { branchAAA: 'branchAAAs' } } }, 'branchA branchAA branchAAA');
// 		assert.lengthOf(r, 1);
// 		assert.sameMembers(r, ['branchAAAs']);
// 	});
//
// 	// 2 branches
//
// 	it('should return the match of the shortcut: 2 branches, 1 level', function() {
// 		let r = buildShortcutCommand({ branchA: 'branchAs', branchB: 'branchBs' }, 'branchB');
// 		assert.lengthOf(r, 1);
// 		assert.sameMembers(r, ['branchBs']);
// 	});
// 	it('should return the match of the shortcut: 2 branches, 2 level', function() {
// 		let r = buildShortcutCommand({
// 			branchA: { branchAA: 'branchAAs' },
// 			branchB: { branchBB: 'branchBBs' }
// 		}, 'branchB branchBB');
// 		assert.lengthOf(r, 1);
// 		assert.sameMembers(r, ['branchBBs']);
// 	});
//
// 	it('should return the match of the shortcut: 2 branches, 3 level', function() {
// 		let r = buildShortcutCommand({
// 			branchA: { branchAA: { branchAAA: 'branchAAAs' } },
// 			branchB: { branchBB: { branchBBB: 'branchBBBs' } }
// 		}, 'branchB branchBB branchBBB');
//
// 		assert.lengthOf(r, 1);
// 		assert.sameMembers(r, ['branchBBBs']);
// 	});
// 	it('should return the match of the shortcut: 2 branches, 2 sub-branches, 3 level', function() {
// 		let r = buildShortcutCommand({
// 			branchA: {
// 				branchAA: { branchAAA: 'branchAAAs' }
// 			},
// 			branchB: {
// 				branchBA: { branchBAA: 'branchBAAs' },
// 				branchBB: { branchBBA: 'branchBBAs' }
// 			}
// 		}, 'branchB branchBB branchBBA');
// 		assert.lengthOf(r, 1);
// 		assert.sameMembers(r, ['branchBBAs']);
// 	});
// });
//

// // });
// //
// // describe('validateAndBuildEnvironments() results', function() {
// // 	it('should resolve the object', function() {
// // 		let r = validateAndBuildEnvironments([{ key1: 'value1' }]);
// // 		assert.deepEqual(r, [{ key1: 'value1' }]);
// // 	});
// // 	it('should resolve the string', function() {
// // 		let r = validateAndBuildEnvironments(['key1']);
// // 		assert.deepEqual(r, [{ key1: 'key1' }]);
// // 	});
// // 	it('should resolve the object x2', function() {
// // 		let r = validateAndBuildEnvironments(['key1', 'key2']);
// // 		assert.deepEqual(r, [{ key1: 'key1' }, { key2: 'key2' }]);
// // 	});
// // 	it('should resolve the object and string', function() {
// // 		let r = validateAndBuildEnvironments([{ key1: 'value1' }, 'key2']);
// // 		assert.deepEqual(r, [{ key1: 'value1' }, { key2: 'key2' }]);
// // 	});
// // 	it('should resolve the string and object', function() {
// // 		let r = validateAndBuildEnvironments(['key1', { key2: 'value2' }]);
// // 		assert.deepEqual(r, [{ key1: 'key1' }, { key2: 'value2' }]);
// // 	});
