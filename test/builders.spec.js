const { assert } = require('chai');
const { messages } = require('../lib/i18n');
const { buildConfig, buildShortcutCommand, buildShortcutPossibilities } = require('../lib/builders');


describe('buildConfig() results', function() {

	it('should merge with an empty object', function() {
		let r = buildConfig({ key1: 'value1' }, {});

		assert.hasAllKeys(r, ['key1']);
		assert.equal(r.key1, 'value1');
	});
	it('should merge from an empty object x2', function() {
		let r = buildConfig({}, { key2: 'value2' });

		assert.hasAllKeys(r, ['key2']);
		assert.equal(r.key2, 'value2');
	});
	it('should merge both objects without collide', function() {
		let r = buildConfig({ key1: 'value1' }, { key2: 'value2' });

		assert.hasAllKeys(r, ['key1', 'key2']);
		assert.equal(r.key1, 'value1');
		assert.equal(r.key2, 'value2');
	});
	it('should merge both objects overwriting the first one', function() {
		let r = buildConfig({ key1: 'value1' }, { key1: 'value2' });

		assert.hasAllKeys(r, ['key1']);
		assert.equal(r.key1, 'value2');
	});
	it('should merge deep object with an empty object', function() {
		let r = buildConfig({ key1: { subKey1: 'subvalue1' } }, {});

		assert.hasAllKeys(r, ['key1']);
		assert.deepNestedPropertyVal(r, 'key1.subKey1', 'subvalue1');
	});
	it('should merge deep object with different objects', function() {
		let r = buildConfig({ key1: { subKey1: 'subvalue1' } }, { key2: { subKey2: 'subvalue2' } });

		assert.hasAllKeys(r, ['key1', 'key2']);
		assert.deepNestedPropertyVal(r, 'key1.subKey1', 'subvalue1');
		assert.deepNestedPropertyVal(r, 'key2.subKey2', 'subvalue2');
	});
	it('should merge deep object overwritten a property', function() {
		let r = buildConfig({ key1: { subKey1: 'subvalue1' } }, { key1: { subKey1: 'subvalue2' } });

		assert.hasAllKeys(r, ['key1']);
		assert.deepNestedPropertyVal(r, 'key1.subKey1', 'subvalue2');
	});
	it('should merge deep object adding a new property', function() {
		let r = buildConfig({ key1: { subKey1: 'subvalue1' } }, { key1: { subKey2: 'subvalue2' } });

		assert.hasAllKeys(r, ['key1']);
		assert.deepNestedPropertyVal(r, 'key1.subKey1', 'subvalue1');
		assert.deepNestedPropertyVal(r, 'key1.subKey2', 'subvalue2');
	});
});


describe('buildShortcutCommand() throws', function() {

	// throws

	it('should throw an error by it does not have match: 1 level', function() {
		let re = new RegExp(messages.shortcut.notFoundFirstShortcut.toTemplate({ shortcut: 'nonBranchA' }));
		assert.throw(() => {
			buildShortcutCommand({ branchA: 'branchAs' }, 'nonBranchA');
		}, re);
	});
	it('should throw an error by it does not have match: 2 branches, 1 level', function() {
		let re = new RegExp(messages.shortcut.notFoundFirstShortcut.toTemplate({ shortcut: 'nonBranchB' }));
		assert.throw(() => {
			buildShortcutCommand({ branchA: 'branchAs', branchB: 'branchBs' }, 'nonBranchB');
		}, re);
	});
	it('should throw an error by it does not have match: 2 branches, 2 level', function() {
		let re = new RegExp(messages.shortcut.notFound.toTemplate({ key: 'branchA', subKey: 'nonBranchAA' }));
		assert.throw(() => {
			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' }, branchB: { branchBB: 'branchBBs' } }, 'branchA nonBranchAA');
		}, re);
	});
	it('should throw an error by it does not have match: 2 branches, 3 level', function() {
		let re = new RegExp(messages.shortcut.notFound.toTemplate({ key: 'branchAA', subKey: 'nonBranchAAA' }));
		assert.throw(() => {
			buildShortcutCommand({
				branchA: { branchAA: { branchAAA: 'branchAAAs' } },
				branchB: { branchBB: { branchBBB: 'branchBBBs' } }
			}, 'branchA branchAA nonBranchAAA');
		}, re);
	});
	it.only('should throw an error by it does not have match even if the match is in other level: 2 level', function() {
		let re = new RegExp(messages.shortcut.notFound.toTemplate({ key: 'branchAA', subKey: 'nonBranchAAA' }));
			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' } }, 'branchA');
		assert.throw(() => {
		}, re);
	});
	it('should throw an error by it does not have match with 2 level, even if it do not send it', function() {
		assert.throw(() => {
			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' } }, 'branchA');
		});
	});

	// does not throw

	it('should not throw an error by correct arguments: 1 level', function() {
		assert.doesNotThrow(() => {
			buildShortcutCommand({ branchA: 'branchAs' }, 'branchA');
		});
	});
	it('should not throw an error by correct arguments: 2 branches, 1 level', function() {
		assert.doesNotThrow(() => {
			buildShortcutCommand({ branchA: 'branchAs', branchB: 'branchBs' }, 'branchB');
		});
	});
	it('should not throw an error by correct arguments: 2 branches, 1 & 2 level', function() {
		assert.doesNotThrow(() => {
			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' }, branchB: 'branchBs' }, 'branchA branchAA');
		});
	});
	it('should not throw an error by correct arguments: 2 branches, 1 & 3 level', function() {
		assert.doesNotThrow(() => {
			buildShortcutCommand({ branchA: { branchAA: { branchAAA: 'branchAAAs' } }, branchB: 'branchBs' }, 'branchA branchAA branchAAA');
		});
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


describe('buildShortcutPosibilities() results', function() {
	it('should return a string without possibilities', () => {
		let r = buildShortcutPossibilities();
		assert.equal(r, '');
	});
	it('should return a string without possibilities', () => {
		let r = buildShortcutPossibilities({});
		assert.equal(r, '');
	});
	it('should return a string without possibilities', () => {
		let r = buildShortcutPossibilities(1);
		assert.equal(r, '');
	});
	it('should return a string without possibilities', () => {
		let r = buildShortcutPossibilities([]);
		assert.equal(r, '');
	});

	it('should return a string with a possibility', () => {
		let r = buildShortcutPossibilities({ key1: 'key1' });
		assert.include(r, '"key1"');
	});
	it('should return a string with two possibility', () => {
		let r = buildShortcutPossibilities({ key1: 'key1', key2: 'key2' });
		assert.include(r, '"key1"');
		assert.include(r, '"key2"');
	});
});
