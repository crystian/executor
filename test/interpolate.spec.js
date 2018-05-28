const { assert, expect } = require('chai');
const { messages } = require('../lib/i18n');
const { interpolateConfigVariables, interpolateVariablesRecursive } = require('../lib/interpolate');

describe('interpolateConfigVariables() throws', function() {

	it('should interpolate variables: 2 variables, between template and shortcuts: 1 level', function() {
		let templates = { template1: 'value1', template2: '${template1} value2' };
		let shortcuts = { short1: '${template1} and short1s', short2: '${template1} and ${template2} and short1s' };
		let config = { templates, shortcuts };

		let r = interpolateConfigVariables(config);

		assert.hasAllKeys(r, ['short1', 'short2']);
		assert.equal(r.short1, 'value1 and short1s');
		assert.equal(r.short2, 'value1 and value1 value2 and short1s');
	});

	it('should interpolate variables: 2 variables, between template and shortcuts and itself: 1 level', function() {
		let templates = { template1: 'value1', template2: 'value2', template3: 'value3' };
		let shortcuts = { short3: '${template1} and short1s', short4: '${template2} and ${template3} and ${short3}' };
		let config = { templates, shortcuts };

		let r = interpolateConfigVariables(config);

		assert.hasAllKeys(r, ['short3', 'short4']);
		assert.equal(r.short3, 'value1 and short1s');
		assert.equal(r.short4, 'value2 and value3 and value1 and short1s');
	});

	it('should interpolate variables: 1 variable, 1 itself: 4 level', function() {
		let templates = { branchA: { branchAA: { branchAAA: { branchAAAA: 'four As' } } } };
		let shortcuts = { short5: '${branchA.branchAA.branchAAA.branchAAAA} found', short6: '${short5} from other short' };
		let config = { templates, shortcuts };

		let r = interpolateConfigVariables(config);

		assert.hasAllKeys(r, ['short5', 'short6']);
		assert.equal(r.short5, 'four As found');
		assert.equal(r.short6, 'four As found from other short');
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

		let r = interpolateConfigVariables(config);

		assert.hasAllKeys(r, ['short1', 'short2', 'short3']);
		assert.equal(r.short1, 'four As found');
		assert.equal(r.short2, 'four As found from other short');
		assert.equal(r.short3, 'from template B four Bs and four As and from shortcuts four As found');
	});
});

describe('interpolateVariablesRecursive()', function() {

	// throws

	it('should throw an error by key not found', function() {
		let targetSource = { key1: 'value1 ${keyNotFound}' };

		expect(() => {

			interpolateVariablesRecursive(targetSource, targetSource, true);

		}).to.throw(ExecutorError).has.property('code', messages.errors.templates.notFound.code);
	});

	it('should throw an error by invalid format', function() {
		let targetSource = { key2: 1 };

		expect(() => {

			interpolateVariablesRecursive(targetSource, targetSource, true);

		}).to.throw(ExecutorError).that.has.property('code', messages.errors.templates.invalidFormat.code);
	});


	// does not throws

	it('should return a simple string without interpolate: 1 variable, 1 level', function() {
		let source = { template1: 'value1' };
		let target = { short1: 'short1s' };

		interpolateVariablesRecursive(target, source, true);

		assert.hasAllKeys(target, ['short1']);
		assert.equal(target.short1, 'short1s');
	});
	it('should return a simple string without interpolate: 2 variables, 1 level', function() {
		let targetSource = { key1: 'value1', key2: 'value2' };

		interpolateVariablesRecursive(targetSource, targetSource, true);

		assert.hasAllKeys(targetSource, ['key1', 'key2']);
		assert.equal(targetSource.key1, 'value1');
		assert.equal(targetSource.key2, 'value2');
	});
	it('should return a simple string without interpolate: 1 variables, 2 level', function() {
		let targetSource = { branchA: { branchAA: 'branchAAs' } };

		interpolateVariablesRecursive(targetSource, targetSource, true);

		assert.hasAllKeys(targetSource, ['branchA']);
		assert.deepNestedPropertyVal(targetSource, 'branchA.branchAA', 'branchAAs');
	});

	it('should interpolate variables: 1 variable, 1 level', function() {
		let targetSource = { branchA: 'branchAs', branchB: '${branchA} branchBs' };

		interpolateVariablesRecursive(targetSource, targetSource, true);

		assert.equal(targetSource.branchB, 'branchAs branchBs');
	});
	it('should interpolate variables: 1 variable, 1 level, 2 times', function() {
		let targetSource = { branchA: 'branchAs', branchB: '${branchA} branchBs ${branchA}' };

		interpolateVariablesRecursive(targetSource, targetSource, true);

		assert.equal(targetSource.branchB, 'branchAs branchBs branchAs');
	});
	it('should interpolate variables: 1 variable, 2 level', function() {
		let targetSource = { branchA: { branchAA: 'branchAAs' }, branchB: { branchBB: '${branchA.branchAA} branchBBs' } };

		interpolateVariablesRecursive(targetSource, targetSource, true);

		assert.equal(targetSource.branchB.branchBB, 'branchAAs branchBBs');
	});
	it('should interpolate variables: 1 variable, different sources: 2 level', function() {
		let target = { branchC: { branchCC: 'branchCCs' }, branchD: { branchDD: '${branchB.branchBB} branchDDs' } };
		let source = { branchA: { branchAA: 'branchAAs' }, branchB: { branchBB: 'branchBBs' } };

		interpolateVariablesRecursive(target, source, true);

		assert.equal(target.branchD.branchDD, 'branchBBs branchDDs');
	});
	it('should interpolate variables: 3 variables, same source: 1 level', function() {
		let targetSource = { key1: 'value1', key2: '${key1} and value2', key3: '${key2} and value3', key4: 'without template' };

		interpolateVariablesRecursive(targetSource, targetSource, true);

		assert.hasAllKeys(targetSource, ['key1', 'key2', 'key3', 'key4']);
		assert.equal(targetSource.key1, 'value1');
		assert.equal(targetSource.key2, 'value1 and value2');
		assert.equal(targetSource.key3, 'value1 and value2 and value3');
		assert.equal(targetSource.key4, 'without template');
	});

	it('should interpolate variables: 1 variable: 4 level', function() {
		let target = { short6: '${branchA.branchAA.branchAAA.branchAAAA} found' };
		let source = { branchA: { branchAA: { branchAAA: { branchAAAA: 'four As' } } } };

		interpolateVariablesRecursive(target, source, true);

		assert.hasAllKeys(target, ['short6']);
		assert.equal(target.short6, 'four As found');
	});

	it('should interpolate variables: 1 variable (4 levels): 4 level', function() {
		let target = { short1: {short11: {short111: {short1111: '${branchA.branchAA.branchAAA.branchAAAA} found'}}} };
		let source = { branchA: { branchAA: { branchAAA: { branchAAAA: 'four As' } } } };

		interpolateVariablesRecursive(target, source, true);

		assert.hasAllKeys(target, ['short1']);
		assert.equal(target.short1.short11.short111.short1111, 'four As found');
	});
});
