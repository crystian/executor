const { assert } = require('chai');
const { buildConfig, buildInterpolateVariables, buildShortcutCommand } = require('../lib/builders');


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


describe('buildInterpolateVariables() throws', function() {

	// throws

	it('should throw an error by invalid arguments', function() {
		assert.throw(() => {
			let templates = { key1: [] };
			let shortcuts = templates;
			let config = { templates, shortcuts };

			buildInterpolateVariables(config);
		});
		assert.throw(() => {
			let templates = { key1: 1 };
			let shortcuts = templates;
			let config = { templates, shortcuts };

			buildInterpolateVariables(config);
		});
		assert.throw(() => {
			let templates = { key1: null };
			let shortcuts = templates;
			let config = { templates, shortcuts };

			buildInterpolateVariables(config);
		});
		assert.throw(() => {
			let templates = { key1: {} };
			let shortcuts = templates;
			let config = { templates, shortcuts };

			buildInterpolateVariables(config);
		});
	});

	it('should throw an error by key not found', function() {
		assert.throw(() => {
			let templates = { key1: 'value1 ${keyNotFound}' };
			let shortcuts = templates;
			let config = { templates, shortcuts };

			buildInterpolateVariables(config);
		});
	});

	it('should throw an error by not shortcuts loaded', function() {
		assert.throw(() => {
			let templates = { key1: 'value1 ${keyNotFound}' };
			let shortcuts = null;
			let config = { templates, shortcuts };

			buildInterpolateVariables(config);
		});
	});

	// does not throw

	it('should not throw an error by correct arguments', function() {
		assert.doesNotThrow(() => {
			let templates = { key1: 'value1', key2: 'value2' };
			let shortcuts = templates;
			let config = { templates, shortcuts };

			let r = buildInterpolateVariables(config);

			buildInterpolateVariables(config);
		});
	});
});

describe('buildInterpolateVariables() results', function() {

	it('should return a simple string without interpolate: 1 variable, 1 level', function() {
		let templates = { template1: 'value1' };
		let shortcuts = { short1: 'short1s' };
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.hasAllKeys(r, ['short1']);
		assert.equal(r.short1, 'short1s');
	});
	it('should return a simple string without interpolate: 2 variables, 1 level', function() {
		let templates = { key1: 'value1', key2: 'value2' };
		let shortcuts = templates;
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.hasAllKeys(r, ['key1', 'key2']);
		assert.equal(r.key1, 'value1');
		assert.equal(r.key2, 'value2');
	});
	it('should return a simple string without interpolate: 1 variables, 2 level', function() {
		let templates = { branchA: { branchAA: 'branchAAs' } };
		let shortcuts = templates;
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.hasAllKeys(r, ['branchA']);
		assert.deepNestedPropertyVal(r, 'branchA.branchAA', 'branchAAs');
	});

	it('should interpolate variables: 1 variable, 1 level', function() {
		let templates = { branchA: 'branchAs', branchB: '${branchA} branchBs' };
		let shortcuts = templates;
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.equal(config.templates.branchB, '${branchA} branchBs');
		assert.equal(r.branchB, 'branchAs branchBs');
	});
	it('should interpolate variables: 1 variable, 1 level, 2 times', function() {
		let templates = { branchA: 'branchAs', branchB: '${branchA} branchBs ${branchA}' };
		let shortcuts = templates;
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.equal(config.templates.branchB, '${branchA} branchBs ${branchA}');
		assert.equal(r.branchB, 'branchAs branchBs branchAs');
	});
	it('should interpolate variables: 1 variable, 2 level', function() {
		let templates = { branchA: { branchAA: 'branchAAs' }, branchB: { branchBB: '${branchA.branchAA} branchBBs' } };
		let shortcuts = templates;
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.equal(templates.branchB.branchBB, '${branchA.branchAA} branchBBs');
		assert.equal(r.branchB.branchBB, 'branchAAs branchBBs');
	});

	it('should interpolate variables: 1 variable, different sources: 2 level', function() {
		let templates = { branchA: { branchAA: 'branchAAs' }, branchB: { branchBB: 'branchBBs' } };
		let shortcuts = { branchC: { branchCC: 'branchCCs' }, branchD: { branchDD: '${branchB.branchBB} branchDDs' } };
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.equal(shortcuts.branchD.branchDD, '${branchB.branchBB} branchDDs');
		assert.equal(r.branchD.branchDD, 'branchBBs branchDDs');
	});

	it('should interpolate variables: 3 variables, same source: 1 level', function() {
		let templates = { key1: 'value1', key2: '${key1} and value2', key3: '${key2} and value3', key4: 'without template' };
		let shortcuts = templates;
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.hasAllKeys(r, ['key1', 'key2', 'key3', 'key4']);
		assert.equal(r.key1, 'value1');
		assert.equal(r.key2, 'value1 and value2');
		assert.equal(r.key3, 'value1 and value2 and value3');
		assert.equal(r.key4, 'without template');
	});

	it('should interpolate variables: 2 variables, between template and shortcuts: 1 level', function() {
		let templates = { template1: 'value1', template2: '${template1} value2' };
		let shortcuts = { short1: '${template1} and short1s', short2: '${template1} and ${template2} and short1s' };
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.hasAllKeys(r, ['short1', 'short2']);
		assert.equal(r.short1, 'value1 and short1s');
		assert.equal(r.short2, 'value1 and value1 value2 and short1s');
	});
	it('should interpolate variables: 2 variables, between template and shortcuts and itself: 1 level', function() {
		let templates = { template1: 'value1', template2: 'value2', template3: 'value3' };
		let shortcuts = { short1: '${template1} and short1s', short2: '${template2} and ${template3} and ${short1}' };
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.hasAllKeys(r, ['short1', 'short2']);
		assert.equal(r.short1, 'value1 and short1s');
		assert.equal(r.short2, 'value2 and value3 and value1 and short1s');
	});

	it('should interpolate variables: 1 variable: 4 level', function() {
		let templates = { branchA: { branchAA: { branchAAA: { branchAAAA: 'four As' } } } };
		let shortcuts = { short1: '${branchA.branchAA.branchAAA.branchAAAA} found' };
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.hasAllKeys(r, ['short1']);
		assert.equal(r.short1, 'four As found');
	});
	it('should interpolate variables: 1 variable, 1 itself: 4 level', function() {
		let templates = { branchA: { branchAA: { branchAAA: { branchAAAA: 'four As' } } } };
		let shortcuts = { short1: '${branchA.branchAA.branchAAA.branchAAAA} found', short2: '${short1} from other short' };
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.hasAllKeys(r, ['short1', 'short2']);
		assert.equal(r.short1, 'four As found');
		assert.equal(r.short2, 'four As found from other short');
	});
	it('should interpolate variables: complex 1', function() {
		let templates = {
			branchA: { branchAA: { branchAAA: { branchAAAA: 'four As' } } },
			branchB: { branchBB: { branchBBB: { branchBBBB: 'four Bs and ${branchA.branchAA.branchAAA.branchAAAA}' } } }
		};
		let shortcuts = {
			short1: '${branchA.branchAA.branchAAA.branchAAAA} found',
			short2: '${short1} from other short',
			short3: 'from template B ${branchB.branchBB.branchBBB.branchBBBB} and from shortcuts ${short1}'
		};
		let config = { templates, shortcuts };

		let r = buildInterpolateVariables(config);

		assert.hasAllKeys(r, ['short1', 'short2', 'short3']);
		assert.equal(r.short1, 'four As found');
		assert.equal(r.short2, 'four As found from other short');
		assert.equal(r.short3, 'from template B four Bs and four As and from shortcuts four As found');
	});
});


describe('buildShortcutCommand() throws', function() {

	// throws

	it('should throw an error by it does not have match: 1 level', function() {
		assert.throw(() => {
			buildShortcutCommand({ branchA: 'branchAs' }, 'nonBranchA');
		});
	});
	it('should throw an error by it does not have match: 2 branches, 1 level', function() {
		assert.throw(() => {
			buildShortcutCommand({ branchA: 'branchAs', branchB: 'branchBs' }, 'nonBranchB');
		});
	});
	it('should throw an error by it does not have match: 2 branches, 2 level', function() {
		assert.throw(() => {
			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' }, branchB: { branchBB: 'branchBBs' } }, 'branchA nonBranchAA');
		});
	});
	it('should throw an error by it does not have match: 2 branches, 3 level', function() {
		assert.throw(() => {
			buildShortcutCommand({
				branchA: { branchAA: { branchAAA: 'branchAAAs' } },
				branchB: { branchBB: { branchBBB: 'branchBBBs' } }
			}, 'branchA branchAA nonBranchAAA');
		});
	});
	it('should throw an error by it does not have match even if the match is in other level: 2 level', function() {
		assert.throw(() => {
			buildShortcutCommand({ branchA: { branchAA: 'branchAAs' } }, 'branchAA');
		});
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
