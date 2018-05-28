const { assert, expect } = require('chai');
const { messages } = require('./i18n');
const { getConfigFromPackageJson, getConfigFromPackageJsonConfigFile, getConfigFromExecutorFile, getConfigFromJson, getConfigFromSources, getConfigMergedWithDefault } = require('./config');

describe('getConfigFromPackageJson()', function() {
	let cwd = process.cwd();
	afterEach('', () => {
		process.chdir(cwd);
	});

	it('should not throw an error by file not found on fixture/02', function() {
		process.chdir('test/fixture/02');

		let r = getConfigFromPackageJson();

		assert.isNull(r);
	});
	it('should read the configuration file on fixture/00', function() {
		process.chdir('test/fixture/00');

		let r = getConfigFromPackageJson();

		assert.empty(r);
	});
	it('should not throw an error by file not found on fixture/03', function() {
		process.chdir('test/fixture/03');

		let r = getConfigFromPackageJson();

		assert.notEmpty(r);
		assert.hasAllKeys(r, 'executor');
	});
});

describe('getConfigFromExecutorFile()', function() {
	let cwd = process.cwd();
	afterEach('', () => {
		process.chdir(cwd);
	});

	it('should read the configuration file on fixture/00', function() {
		process.chdir('test/fixture/00');

		let r = getConfigFromExecutorFile();

		assert.empty(r);
	});
	it('should not throw an error by file not found on fixture/02', function() {
		process.chdir('test/fixture/02');

		let r = getConfigFromExecutorFile();

		assert.isNull(r);
	});
	it('should not throw an error by file not found on fixture/03', function() {
		process.chdir('test/fixture/03');

		let r = getConfigFromExecutorFile();

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

			getConfigFromPackageJsonConfigFile({ executor: { configFile: 'falseConfig.json' } });

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

		let r = getConfigFromPackageJsonConfigFile({ executor: {} });

		assert.isNull(r);
	});
	it('should return an empty object by not define config', function() {
		process.chdir('test/fixture/03');

		let r = getConfigFromPackageJsonConfigFile({ executor: { configFile: 'config.json' } });

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
	let cwd = process.cwd();
	let packageCommon2 = {
		executor: {
			templates: {
				template1: 'template1s',
				template2: 'template2s'
			}
		}
	};
	let executorCommon2 = {
		templates: {
			template1: 'template1b',
			template2: 'template2b',
			template3: 'template3s'
		}
	};
	let configCommon2 = {
		templates: {
			template2: 'template2c',
			template3: 'template3s'
		}
	};

	afterEach('', () => {
		process.chdir(cwd);
	});

	it('should get the config via package only', function() {
		process.chdir('test/fixture/02');

		let r = getConfigFromSources();

		assert.deepEqual(r, {
			packageJson: null,
			configFile: null,
			executorFile: null
		});
	});

	it('should get the config via package only', function() {
		process.chdir('test/fixture/04');

		let r = getConfigFromSources();

		assert.deepEqual(r, {
			packageJson: packageCommon2,
			configFile: null,
			executorFile: null
		});
	});
	it('should get the config via package and executor.json', function() {
		process.chdir('test/fixture/05');

		let r = getConfigFromSources();

		assert.deepEqual(r, {
			packageJson: packageCommon2,
			configFile: null,
			executorFile: {
				templates: {
					template2: 'template2b',
					template3: 'template3s'
				}
			}
		});
	});
	it('should get the config via package and configFile without executor.json', function() {
		process.chdir('test/fixture/06');

		let r = getConfigFromSources();

		assert.deepEqual(r, {
			packageJson: {
				executor: {
					configFile: 'newConfig.json',
					templates: {
						template1: 'template1s',
						template2: 'template2s'
					}
				}
			},
			configFile: configCommon2,
			executorFile: executorCommon2
		});
	});


	it('should get the config via package and configFile sub/sub-folder without executor.json', function() {
		process.chdir('test/fixture/07');

		let r = getConfigFromSources();

		assert.deepEqual(r, {
			packageJson: {
				executor: {
					configFile: 'sub/sub/newConfig.json',
					templates: {
						template1: 'template1s',
						template2: 'template2s'
					}
				}
			},
			configFile: configCommon2,
			executorFile: executorCommon2
		});
	});

	it('should get the config via package and configFile under/under-folder without executor.json', function() {
		process.chdir('test/fixture/08/sub/sub');

		let r = getConfigFromSources();

		assert.deepEqual(r, {
			packageJson: {
				executor: {
					configFile: '../../newConfig.json',
					templates: {
						template1: 'template1s',
						template2: 'template2s'
					}
				}
			},
			configFile: configCommon2,
			executorFile: executorCommon2
		});
	});
});


describe('getConfigMergedWithDefault()', function() {
	it('should merge config with default (add)', function() {

		let r = getConfigMergedWithDefault({ templates: { template1: 'template1s' } });

		assert.equal(r.templates.template1, 'template1s');
		assert.isOk(r.templates.hello);
	});

	it('should merge config with default (overwrite)', function() {

		let r = getConfigMergedWithDefault({ templates: { hello: 'works' } });

		assert.equal(r.templates.hello, 'works');
	});
});
