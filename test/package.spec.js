const { assert } = require('chai');
const { messages } = require('../lib/i18n');
const { getConfig } = require('../lib/node');

let notFound = new RegExp(messages.config.notFound.toTemplate({ fileName: 'executor.json' }));

describe('getConfigFromCWD() result', function() {
	let cwd = process.cwd();
	beforeEach('', () => {
	});
	afterEach('', () => {
		process.chdir(cwd);
	});
	it('10', function() {
		process.chdir('test/fixture/10');

		assert.throw(() => {
			getConfig();
		}, notFound);
	});
	it('11', function() {
		process.chdir('test/fixture/11');

		getConfig();
	});

	it('12', function() {
		process.chdir('test/fixture/12');

		let r = getConfig();

		assert.equal(r.configFile, 'newConfig.json');
		assert.isOk(r.runScripts);
		assert.isOk(r.useScripts);
		assert.equal(r.shortcuts.short1, '${script1} from package.json');
		assert.equal(r.shortcuts.short2, 'from newConfig.json');
	});

	it('13 throw', function() {
		process.chdir('test/fixture/13');
		let notFoundNewFile = new RegExp(messages.config.notFound.toTemplate({ fileName: 'newConfig.json' }));

		assert.throw(() => {
			getConfig();
		}, notFoundNewFile);
	});

	it('14', function() {
		process.chdir('test/fixture/14');

		let r = getConfig();

		assert.isNotOk(r.configFile);
		assert.isOk(r.runScripts);
		assert.isOk(r.useScripts);
		assert.equal(r.shortcuts.short1, '${script1} from package.json');
		assert.equal(r.shortcuts.short2, 'from newConfig.json');
	});

	it('15', function() {
		process.chdir('test/fixture/15');

		let r = getConfig();

		assert.isNotOk(r.configFile);
		assert.isOk(r.runScripts);
		assert.isOk(r.useScripts);
		assert.equal(r.shortcuts.short1, '${script1} from package.json');
	});

	it('16', function() {
		process.chdir('test/fixture/16');

		let r = getConfig();

		assert.isNotOk(r.configFile);
		assert.equal(r.shortcuts.short2, 'from executor.json');
	});

	it('17', function() {
		process.chdir('test/fixture/17');

		assert.throw(() => {
			getConfig();
		}, notFound);
	});

	it('18', function() {
		// process.chdir('test/fixture/18');
		//
		// 	getConfig();


		// assert.throw(() => {
		// }, notFound);
	});
});

