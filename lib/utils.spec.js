const { assert } = require('chai');
const { messages } = require('../lib/i18n');
const { getContentFile, isString, isObject, isObjectEmpty, isTestRunning, setColor, mergeDeep } = require('../lib/utils');

describe('toTemplate()', function() {

	it('should resolve without template', function() {
		assert.equal(messages.test.template, 'do not modify ${value}');
	});
	it('should resolve with a template', function() {
		assert.equal(messages.test.template.toTemplate({ value: 'it' }), 'do not modify it');
	});
	it('should resolve with a wrong template', function() {
		assert.equal(messages.test.template.toTemplate({ invalid: 'it' }), 'do not modify ${value}');
	});

});

describe('getContentFile()', function() {

	it('should read test 00 (sub-folder)', function() {
		let r = getContentFile('test/fixture/00/package.json');

		assert.isString(r);
		assert.equal(r, '{}\n');
	});

	it('should throw an error by file not found', function() {
		let fileName = 'fileNotFound.json';
		assert.throw(() => {
			getContentFile(fileName);
		}, messages.config.notFound.toTemplate({ fileName }));
	});

});

describe('isString()', function() {

	it('should return true 1', function() {
		let r = isString('this is a string');

		assert.isBoolean(r);
		assert.isOk(r);
	});

	it('should return true 2', function() {
		let r = isString('');

		assert.isBoolean(r);
		assert.isOk(r);
	});

	it('should return false 1', function() {
		let r = isString([]);

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 2', function() {
		let r = isString({});

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 3', function() {
		let r = isString(1);

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 4', function() {
		let r = isString();

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 5', function() {
		let r = isString([]);

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 6', function() {
		let r = isString(true);

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

});

describe('isObject()', function() {

	it('should return true 1', function() {
		let r = isObject({});

		assert.isBoolean(r);
		assert.isOk(r);
	});

	it('should return true 2', function() {
		let r = isObject({ key: '' });

		assert.isBoolean(r);
		assert.isOk(r);
	});

	it('should return true 3', function() {
		let r = isObject('');

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 1', function() {
		let r = isObject();

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 2', function() {
		let r = isObject([]);

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 3', function() {
		let r = isObject(1);

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 4', function() {
		let r = isObject(true);

		assert.isBoolean(r);
		assert.isNotOk(r);
	});
});

describe('isObjectEmpty()', function() {

	it('should return true 1', function() {
		let r = isObjectEmpty({});

		assert.isBoolean(r);
		assert.isOk(r);
	});

	it('should return false 2', function() {
		let r = isObjectEmpty({ key: '' });

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 3', function() {
		let r = isObjectEmpty();

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 4', function() {
		let r = isObjectEmpty('');

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 5', function() {
		let r = isObjectEmpty([]);

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 6', function() {
		let r = isObjectEmpty(1);

		assert.isBoolean(r);
		assert.isNotOk(r);
	});

	it('should return false 7', function() {
		let r = isObjectEmpty(true);

		assert.isBoolean(r);
		assert.isNotOk(r);
	});
});

describe('isTestRunning()', function() {

	it('should return true', function() {
		let r = isTestRunning();

		assert.isBoolean(r);
		assert.isOk(r);
	});
});

describe('setColor()', function() {
	it('should return an array with the color in element 0', () => {
		let r = setColor(true, 'color1', ['arg1']);

		assert.equal(r[0], 'color1');
		assert.equal(r[1], 'arg1');
		assert.equal(r.length, 2);
	});
	it('should return an array without the color in element 0', () => {
		let r = setColor(false, 'color1', ['arg1']);

		assert.equal(r[0], 'arg1');
		assert.equal(r.length, 1);
	});
});

describe('mergeDeep()', function() {
	let e1 = messages.global.mergeDeepInvalidObjects;

	it('should throw an error by empty arguments', () => {
		assert.throw(() => {
			mergeDeep();
		}, e1);
	});

	it('should not throw an error by empty objects', () => {
		assert.doesNotThrow(() => {
			let r = mergeDeep({}, {});
			assert.isObject(r);
			assert.equal(Object.keys(r).length, 0);
		});
	});

	it('should merge two basic objects 1', () => {
		let r = mergeDeep({ key1: 'key1s' }, { key2: 'key2s' });

		assert.isObject(r);
		assert.equal(r.key1, 'key1s');
		assert.equal(r.key2, 'key2s');
	});

	it('should merge two basic objects 2', () => {
		let r = mergeDeep({}, { key2: 'key2s' });

		assert.isObject(r);
		assert.isNotOk(r.key1);
		assert.equal(r.key2, 'key2s');
	});

	it('should merge two basic objects 3', () => {
		let r = mergeDeep({ key1: 'key1s' }, {});

		assert.isObject(r);
		assert.equal(r.key1, 'key1s');
		assert.isNotOk(r.key2);
	});

	it('should overwrite values', () => {
		let r = mergeDeep({ key1: 'key1s' }, { key1: 'key22s' });

		assert.isObject(r);
		assert.equal(r.key1, 'key22s');
	});

	it('should merge two deeper objects 1', () => {
		let r = mergeDeep({ key1: { key11: 'key11s' } }, { key2: { key22: 'key22s' } });

		assert.isObject(r);
		assert.equal(r.key1.key11, 'key11s');
		assert.equal(r.key2.key22, 'key22s');
	});

	it('should merge two deeper objects 2', () => {
		let r = mergeDeep({ key1: { key11: 'key11s' } }, { key1: { key22: 'key22s' } });

		assert.isObject(r);
		assert.equal(r.key1.key11, 'key11s');
		assert.equal(r.key1.key22, 'key22s');
	});

	it('should merge two deeper objects 3', () => {
		let r = mergeDeep({}, { key2: { key22: 'key22s' } });

		assert.isObject(r);
		assert.isNotOk(r.key1);
		assert.equal(r.key2.key22, 'key22s');
	});

	it('should merge two deeper objects 4', () => {
		let r = mergeDeep({ key1: { key11: 'key11s' } }, {});

		assert.isObject(r);
		assert.equal(r.key1.key11, 'key11s');
		assert.isNotOk(r.key2);
	});

	it('should overwrite deeper values 1', () => {
		let r = mergeDeep({ key1: { key11: 'key11s' } }, { key1: { key11: 'key22s' } });

		assert.isObject(r);
		assert.equal(r.key1.key11, 'key22s');
	});

	it('should overwrite deeper values 2', () => {
		let r = mergeDeep({ key1: { key11: 'key11s' }, key2: 'key2s' }, { key1: { key11: 'key22s' } });

		assert.isObject(r);
		assert.equal(r.key1.key11, 'key22s');
		assert.equal(r.key2, 'key2s');
	});

	it('should overwrite deeper values 3', () => {
		let r = mergeDeep({ key1: { key11: 'key11s' } }, { key1: { key11: 'key22s' }, key2: 'key2s' });

		assert.isObject(r);
		assert.equal(r.key1.key11, 'key22s');
		assert.equal(r.key2, 'key2s');
	});

	it('should overwrite deeper values 4', () => {
		let r = mergeDeep({ key1: { key11: 'key11s' }, key2: 'key2s' }, { key1: { key11: 'key22s' }, key2: 'key2o' });

		assert.isObject(r);
		assert.equal(r.key1.key11, 'key22s');
		assert.equal(r.key2, 'key2o');
	});


});

