const { spawn } = require('child_process');
const { assert } = require('chai');

/**
 * I know, it is an ugly file, but... works!
 */

describe('running on docker container', function() {
	let cwd = process.cwd();
	let spawnOption = {
		timeout: 1000 * 60 * 5,
		shell: true,
		stdio: 'inherit'
	};

	function dockerBuild(done) {
		// return dockerRun(done);
		spawn('docker', 'build -f ./test/docker/Dockerfile -t executor .'.split(' '), spawnOption)
			.on('exit', (code) => {

				if (code === 0) {
					dockerRun(done);
				} else {
					throw new Error('Error on BUILD image on docker, check the stack please');
				}

			});
	}

	function dockerRun(done) {
		// enter: docker run --init -d --rm -it --name executor executor sh
		spawn('docker', 'run --init -d --rm -i --name executor executor'.split(' '), spawnOption)
			.on('exit', (code) => {
				if (code === 0) {
					done();
				} else {
					throw new Error('Error on RUN image on docker, check the stack please');
				}

			});
	}

	function dockerStop(done) {
		spawn('docker', 'stop executor'.split(' '), spawnOption)
			.on('exit', (code) => {
				if (code === 0) {
					done();
				} else {
					throw new Error('Error on STOP image on docker, check the stack please');
				}

			});
	}

	before(done => {
		dockerBuild(done);
	});
	after(done => {
		dockerStop(done);
	});

	afterEach('', () => {
		process.chdir(cwd);
	});

	function runIt(command, cwd, done) {
		spawn('docker', `exec executor ash -c "cd ${cwd} && x ${command}"`.split(' '), spawnOption)
			.on('exit', (code) => {
				done(code);
			});
	}



	// does not throws

	it('should not throw an error by hello', function(done) {
		runIt('hello', 'test/00', (code) => {
			assert.equal(0, code);
			done();
		});
	});

	// does not throws
	//
	// it('should not throw an error by hello world!', function () {
	// 	process.chdir('test/docker/00');
	//
	// 	let r;
	// 	assert.doesNotThrow(() => {
	// 		r = buildCommand('hello');
	// 	});
	//
	// 	assert.isOk(r);
	// 	assert.notEmpty(r);
	// });
	// it('should not throw an error by hello world! even package.json configured', function () {
	// 	process.chdir('test/docker/11');
	//
	// 	let r = buildCommand('hello');
	//
	// 	assert.isOk(r);
	// 	assert.notEmpty(r);
	// });
	// it('should not throw an error by hello world! redefined!', function () {
	// 	process.chdir('test/docker/18');
	//
	// 	let r = buildCommand('hello');
	//
	// 	assert.isOk(r);
	// 	assert.notEmpty(r);
	// 	assert.equal(r.command, 'echo from package.json');
	// });
	//
	//
	// it('should not throw an error, from package.json', function () {
	// 	process.chdir('test/docker/11');
	//
	// 	let r = buildCommand('shortcuts1');
	//
	// 	assert.equal(r.command, 'echo shortcut1s and template1s');
	// });
	//
	// it('should not throw an error, from executor.json', function () {
	// 	process.chdir('test/docker/12');
	//
	// 	let r = buildCommand('shortcuts1');
	//
	// 	assert.equal(r.command, 'shortcut1s and template1s');
	// });
	//
	// it('should not throw an error, from newExecutor.json', function () {
	// 	process.chdir('test/docker/13');
	//
	// 	let r = buildCommand('shortcuts1');
	//
	// 	assert.equal(r.command, 'shortcut1s and template1s');
	// });
	//
	// it('should not throw an error, from executor.json and package.json', function () {
	// 	process.chdir('test/docker/14');
	//
	// 	let r = buildCommand('shortcuts1');
	//
	// 	assert.equal(r.command, 'shortcut1s and template1s');
	// });
	//
	// it('should not throw an error, from newExecutor.json and package.json', function () {
	// 	process.chdir('test/docker/15');
	//
	// 	let r = buildCommand('shortcuts1');
	//
	// 	assert.equal(r.command, 'shortcut1s and template1s');
	// });
	//
	// it('should not throw an error, from executor.json and package.json inverted', function () {
	// 	process.chdir('test/docker/16');
	//
	// 	let r = buildCommand('shortcuts1');
	//
	// 	assert.equal(r.command, 'shortcut1s and template1s');
	// });
	//
	// it('should not throw an error, from executor.json and package.json inverted', function () {
	// 	process.chdir('test/docker/17');
	//
	// 	let r = buildCommand('shortcuts1');
	//
	// 	assert.equal(r.command, 'shortcut1s and template1s');
	// });
	//
	// // throws
	//
	// it('should throw an error by not config', function () {
	// 	expect(() => {
	//
	// 		buildCommand();
	//
	// 	}).to.throw(ExecutorError).that.has.property('code', code404);
	// });
	//
	// it('should throw an error by configuration not found, empty folder', function () {
	// 	process.chdir('test/docker/00');
	//
	// 	expect(() => {
	// 		buildCommand();
	// 	}).to.throw(ExecutorError).that.has.property('code', code404);
	// });
	//
	// it('should throw an error by configuration not found, package.json without config', function () {
	// 	process.chdir('test/docker/01');
	//
	// 	expect(() => {
	// 		buildCommand();
	// 	}).to.throw(ExecutorError).that.has.property('code', code404);
	//
	// 	expect(() => {
	// 		buildCommand('a');
	// 	}).to.throw(ExecutorError).that.has.property('code', code404);
	// });
	//
	// it('should throw an error by configuration not found on executor.json', function () {
	// 	process.chdir('test/docker/02');
	//
	// 	expect(() => {
	// 		buildCommand();
	// 	}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.notConfigurationOnFile.code);
	// });
	//
	// it('should throw an error by configuration found on package.json but without arguments', function () {
	// 	process.chdir('test/docker/04');
	//
	// 	expect(() => {
	// 		buildCommand();
	// 	}).to.throw(ExecutorError).that.has.property('code', messages.errors.shortcut.withoutArguments.code);
	// });
	//
	// it('should throw an error by configuration found on executor.json and package.json but without arguments', function () {
	// 	process.chdir('test/docker/05');
	//
	// 	expect(() => {
	// 		buildCommand();
	// 	}).to.throw(ExecutorError).that.has.property('code', messages.errors.shortcut.withoutArguments.code);
	// });
	//
	// it('should throw an error by configuration found on executor.json but without arguments', function () {
	// 	process.chdir('test/docker/06');
	//
	// 	expect(() => {
	// 		buildCommand();
	// 	}).to.throw(ExecutorError).that.has.property('code', messages.errors.shortcut.withoutArguments.code);
	// });
	//
	// it('should throw an error by configuration not found on newExecutor.json', function () {
	// 	process.chdir('test/docker/07');
	//
	// 	expect(() => {
	// 		buildCommand();
	// 	}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.notConfigurationOnFile.code);
	// });
	//
	// it('should throw an error by configuration found on package.json even with an empty newExecutor.json', function () {
	// 	process.chdir('test/docker/08');
	//
	// 	expect(() => {
	// 		buildCommand();
	// 	}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.notConfigurationOnFile.code);
	// });
	//
	// it('should throw an error by configuration found on package.json even with an empty executor.json', function () {
	// 	process.chdir('test/docker/09');
	//
	// 	expect(() => {
	// 		buildCommand();
	// 	}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.notConfigurationOnFile.code);
	// });
	//
	// it('should throw an error by file not found', function () {
	// 	process.chdir('test/docker/10');
	//
	// 	expect(() => {
	// 		buildCommand();
	// 	}).to.throw(ExecutorError).that.has.property('code', messages.errors.config.internalNotFound.code);
	// });
});
