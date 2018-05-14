const { assert } = require('chai');
const { getAbsoluteCWD, getContentJsonFile, getConfigFileName, getConfig, getConfigFromCWD } = require('../lib/node');
const { setColor } = require('../lib/utils');
const path = require('path');

describe('getConfigFromCWD() throws', function() {
	it('should throw an error by file not found: executor.json', function() {
		assert.throw(() => {
			getConfigFromCWD();
		});
	});
});
describe('getConfigFromCWD() result', function() {
	let cwd = process.cwd();
	beforeEach('', () => {
	});
	afterEach('', () => {
		process.chdir(cwd);
	});
	it('should read the executor.json on the fixture folder', function() {
		process.chdir('test/fixture/00');

		let r = getConfigFromCWD();

		assert.equal(r.shortcuts.hello, 'world');
	});
});


describe('getAbsoluteCWD() result', function() {
	it('should return the current cwd', function() {
		let r = getAbsoluteCWD();
		assert.include(r, path.basename(process.cwd()));
	});
});


describe('getConfig() throws', function() {
	let cwd = process.cwd();
	beforeEach('', () => {
	});
	afterEach('', () => {
		process.chdir(cwd);
	});

	it('should throw an error by does not exist the configuration file', function() {
		process.chdir('test/fixture/01');

		assert.throw(() => {
			getConfig();
		});
	});
	it('should throw an error by configuration on package.json is not a string: {}', function() {
		process.chdir('test/fixture/03');

		assert.throw(() => {
			getConfig();
		});
	});
	it('should throw an error by configuration on package.json is not a string: 1', function() {
		process.chdir('test/fixture/04');

		assert.throw(() => {
			getConfig();
		});
	});
	it('should throw an error by configuration on package.json is a string and point to a not exist file', function() {
		process.chdir('test/fixture/08');

		assert.throw(() => {
			getConfig();
		});
	});
});

describe('getConfig() result', function() {
	let cwd = process.cwd();
	beforeEach('', () => {
	});
	afterEach('', () => {
		process.chdir(cwd);
	});

	it('should read the configuration file on fixture/02', function() {
		process.chdir('test/fixture/02');

		let r = getConfig();

		assert.equal(r.shortcuts.hello, 'world');
	});
	it('should read the configuration file on fixture/05: other configuration file', function() {
		process.chdir('test/fixture/05');

		let r = getConfig();

		assert.equal(r.shortcuts.hello, 'world from new config');
	});
	it('should read the configuration file on fixture/06: other configuration file in another folder', function() {
		process.chdir('test/fixture/06');

		let r = getConfig();

		assert.equal(r.shortcuts.hello, 'world from new config from a folder');
	});
});

describe('getConfigFileName() throws: via argument', function() {
	it('should resolve the configuration file name: with package.json, with invalid configuration 1', function() {
		assert.throw(() => {
			getConfigFileName('test/fixture/03');
		});
	});
	it('should resolve the configuration file name: with package.json, with invalid configuration 2', function() {
		assert.throw(() => {
			getConfigFileName('test/fixture/04');
		});
	});
});

describe('getConfigFileName() results: via argument', function() {
	it('should resolve the configuration file name: without package.json', function() {
		let r = getConfigFileName('test/fixture/00');

		assert.equal(r, 'executor.json');
	});
	it('should resolve the configuration file name: with package.json, with not configuration 1', function() {
		let r = getConfigFileName('test/fixture/01');

		assert.equal(r, 'executor.json');
	});
	it('should resolve the configuration file name: with package.json, with not configuration 2', function() {
		let r = getConfigFileName('test/fixture/02');

		assert.equal(r, 'executor.json');
	});
	it('should resolve the configuration file name: with package.json, with a valid configuration to another file', function() {
		let r = getConfigFileName('test/fixture/05');

		assert.equal(r, 'newConfig.json');
	});
	it('should resolve the configuration file name: with package.json, with a valid configuration to another file on another folder', function() {
		let r = getConfigFileName('test/fixture/06');

		assert.equal(r, 'folder1/newConfig.json');
	});
});

describe('getConfigFileName() throws: via cwd', function() {
	let cwd = process.cwd();
	beforeEach('', () => {
	});
	afterEach('', () => {
		process.chdir(cwd);
	});

	it('should resolve the configuration file name: with package.json, with invalid configuration 1', function() {
		process.chdir('test/fixture/03');

		assert.throw(() => {
			getConfigFileName();
		});
	});
	it('should resolve the configuration file name: with package.json, with invalid configuration 2', function() {
		process.chdir('test/fixture/04');

		assert.throw(() => {
			getConfigFileName();
		});
	});
});

describe('getConfigFileName() results: via cwd', function() {
	let cwd = process.cwd();
	beforeEach('', () => {
	});
	afterEach('', () => {
		process.chdir(cwd);
	});

	it('should resolve the configuration file name: without package.json', function() {
		process.chdir('test/fixture/01');

		let r = getConfigFileName();

		assert.equal(r, 'executor.json');
	});
	it('should resolve the configuration file name: with package.json, with not configuration 1', function() {
		process.chdir('test/fixture/02');

		let r = getConfigFileName();

		assert.equal(r, 'executor.json');
	});

	it('should resolve the configuration file name: with package.json, with a valid configuration to another file', function() {
		process.chdir('test/fixture/05');

		let r = getConfigFileName();

		assert.equal(r, 'newConfig.json');
	});
	it('should resolve the configuration file name: with package.json, with a valid configuration to another file on another folder', function() {
		process.chdir('test/fixture/06');

		let r = getConfigFileName();

		assert.equal(r, 'folder1/newConfig.json');
	});
});


describe('getContentJsonFile() throws', function() {
	it('should throw an error by it is not a valid json', function() {
		assert.throw(() => {
			getContentJsonFile('bin/index.js');
		});
	});
	it('should not throw an error by it is a valid json', function() {
		assert.doesNotThrow(() => {
			let r = getContentJsonFile('package.json');
			assert.equal(r.name, 'executor');
		});
	});
});

// yes, it is from utils...

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
