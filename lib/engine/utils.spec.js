const { assert, expect } = require('chai');
const { messages } = require('./i18n');
const { getContentFile, getContentFileJson, isString, isObject, isObjectEmpty, isTestRunning, mergeDeep } = require('./utils');


describe('getContentFile()', function() {

	it('should read test 00 (sub-folder)', function() {
		let r = getContentFile('test/fixture/00/package.json');

		assert.isString(r);
		assert.equal(r, '{}\n');
	});

	it('should throw an error by file not found', function() {
		expect(() => {

			getContentFile('fileNotFound.json');

		}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.notFound.code);
	});

});

describe('getContentFileJson()', function() {

	it('should read test 00 (sub-folder)', function() {
		let r = getContentFileJson('test/fixture/00/package.json');

		assert.isObject(r);
		assert.isEmpty(r);
	});

	it('should throw an error by invalid format on file', function() {
		expect(() => {

			getContentFileJson('test/fixture/01/package.json');

		}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.invalidJson.code);
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

describe('mergeDeep()', function() {
	it('should throw an error by empty arguments', () => {
		expect(() => {

			mergeDeep();

		}).to.throw(ExecutorError).that.has.property('code', messages.errors.global.mergeDeepInvalidObjects.code);
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
