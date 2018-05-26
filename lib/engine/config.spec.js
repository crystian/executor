const { assert, expect } = require('chai');
const { messages } = require('./i18n');
const { getConfigFromPackageJson, getConfigFromPackageJsonConfigFile, getConfigFromConfigFile, getConfigFromJson, getConfigFromSources } = require('./config');

describe('getConfigFromPackageJson()', function() {
	let cwd = process.cwd();
	afterEach('', () => {
		process.chdir(cwd);
	});

	it('should read the configuration file on fixture/00', function() {
		process.chdir('test/fixture/00');

		let r = getConfigFromPackageJson();

		assert.empty(r);
	});
	it('should not throw an error by file not found on fixture/02', function() {
		process.chdir('test/fixture/02');

		let r = getConfigFromPackageJson();

		assert.isNull(r);
	});
	it('should not throw an error by file not found on fixture/03', function() {
		process.chdir('test/fixture/03');

		let r = getConfigFromPackageJson();

		assert.notEmpty(r);
		assert.hasAllKeys(r, 'executor');
	});
});

describe('getConfigFromConfigFile()', function() {
	let cwd = process.cwd();
	afterEach('', () => {
		process.chdir(cwd);
	});

	it('should read the configuration file on fixture/00', function() {
		process.chdir('test/fixture/00');

		let r = getConfigFromConfigFile();

		assert.empty(r);
	});
	it('should not throw an error by file not found on fixture/02', function() {
		process.chdir('test/fixture/02');

		let r = getConfigFromConfigFile();

		assert.isNull(r);
	});
	it('should not throw an error by file not found on fixture/03', function() {
		process.chdir('test/fixture/03');

		let r = getConfigFromConfigFile();

		assert.notEmpty(r);
		assert.hasAllKeys(r, 'templates');
	});
});


describe('getConfigFromPackageJsonConfigFile()', function() {
	let cwd = process.cwd();
	afterEach('', () => {
		process.chdir(cwd);
	});

	// throws

	it('should throw an error by file not found', function() {
		process.chdir('test/fixture/03');

		expect(() => {

			getConfigFromPackageJsonConfigFile({executor: { configFile: 'falseConfig.json'}});

		}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.notFound.code);
	});

	// does not throws

	it('should return an empty object by not define config 1', function() {
		process.chdir('test/fixture/03');

		let r = getConfigFromPackageJsonConfigFile();

		assert.isNull(r);
	});

	it('should return an empty object by not define config 2', function() {
		process.chdir('test/fixture/03');

		let r = getConfigFromPackageJsonConfigFile({});

		assert.isNull(r);
	});
	it('should return an empty object by not define config 3', function() {
		process.chdir('test/fixture/03');

		let r = getConfigFromPackageJsonConfigFile({executor:{}});

		assert.isNull(r);
	});
	it('should return an empty object by not define config', function() {
		process.chdir('test/fixture/03');

		let r = getConfigFromPackageJsonConfigFile({executor: { configFile: 'config.json'}});

		assert.notEmpty(r);
		assert.hasAllKeys(r, 'templates');
	});
});

describe('getConfigFromJson()', function() {

	it('should read test 00 (sub-folder)', function() {
		let r = getConfigFromJson('test/fixture/00', 'package.json');

		assert.isObject(r);
		assert.isEmpty(r);
	});

	it('should throw an error by invalid format on file', function() {
		expect(() => {

			getConfigFromJson('test/fixture/01', 'package.json');

		}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.invalidJson.code);
	});

	it('should throw an error by invalid format on file', function() {
		expect(() => {

			getConfigFromJson('test/fixture/01', '');

		}).to.throw(Error); // of file system
	});

	it('should not throw an error by folder without config', function() {
		assert.doesNotThrow(() => {
			getConfigFromJson('test/fixture/02', 'package.json');
		});
	});

	it('should not throw an error by folder without config', function() {
		expect(() => {

			getConfigFromJson('test/fixture/03', 'badConfig.json');

		}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.invalidJson.code);
	});

	it('should not throw an error by folder without config', function() {
		assert.doesNotThrow(() => {
			getConfigFromJson('test/fixture/03', 'config.json');
		});
	});

});


describe('getConfigFromSources()', function() {

	it('should ', function() {
		getConfigFromSources();

		// assert.isObject(r);
		// assert.isEmpty(r);
	});
});
