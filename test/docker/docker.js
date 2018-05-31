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
		// enter: docker run --init --rm -it --name executor executor ash
		// stop: docker stop executor
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

	it('should not throw an error by hello world! even package.json configured', function (done) {
		runIt('hello', 'test/11', (code) => {
			assert.equal(0, code);
			done();
		});
	});
	it('should not throw an error by hello world! redefined!', function (done) {
		runIt('hello', 'test/18', (code) => {
			assert.equal(0, code);
			done();
		});
	});
	it('should not throw an error, from package.json', function (done) {
		runIt('shortcuts1', 'test/11', (code) => {
			assert.equal(0, code);
			done();
		});
	});
	it('should not throw an error, from executor.json', function (done) {
		runIt('shortcuts1', 'test/12', (code) => {
			assert.equal(0, code);
			done();
		});
	});
	it('should not throw an error, from newExecutor.json', function (done) {
		runIt('shortcuts1', 'test/13', (code) => {
			assert.equal(0, code);
			done();
		});
	});
	it('should not throw an error, from executor.json and package.json', function (done) {
		runIt('shortcuts1', 'test/14', (code) => {
			assert.equal(0, code);
			done();
		});
	});
	it('should not throw an error, from newExecutor.json and package.json', function (done) {
		runIt('shortcuts1', 'test/15', (code) => {
			assert.equal(0, code);
			done();
		});
	});
	it('should not throw an error, from executor.json and package.json inverted', function (done) {
		runIt('shortcuts1', 'test/16', (code) => {
			assert.equal(0, code);
			done();
		});
	});
	it('should not throw an error, from executor.json and package.json inverted', function (done) {
		runIt('shortcuts1', 'test/17', (code) => {
			assert.equal(0, code);
			done();
		});
	});

	// throws

	it('should throw an error by not config', function (done) {
		runIt('', 'test/00', (code) => {
			assert.equal(1, code);
			done();
		});
	});
	it('should throw an error by configuration not found, package.json without config', function (done) {
		runIt('a', 'test/01', (code) => {
			assert.equal(1, code);
			done();
		});
	});

	it('should throw an error by configuration not found on executor.json', function (done) {
		runIt('a', 'test/02', (code) => {
			assert.equal(1, code);
			done();
		});
	});
	it('should throw an error by configuration found on package.json but without arguments', function (done) {
		runIt('', 'test/04', (code) => {
			assert.equal(1, code);
			done();
		});
	});
	it('should throw an error by configuration found on executor.json and package.json but without arguments', function (done) {
		runIt('', 'test/05', (code) => {
			assert.equal(1, code);
			done();
		});
	});
	it('should throw an error by configuration found on executor.json but without arguments', function (done) {
		runIt('', 'test/06', (code) => {
			assert.equal(1, code);
			done();
		});
	});
	it('should throw an error by configuration not found on newExecutor.json', function (done) {
		runIt('', 'test/07', (code) => {
			assert.equal(1, code);
			done();
		});
	});
	it('should throw an error by configuration found on package.json even with an empty newExecutor.json', function (done) {
		runIt('', 'test/08', (code) => {
			assert.equal(1, code);
			done();
		});
	});
	it('should throw an error by configuration found on package.json even with an empty executor.json', function (done) {
		runIt('', 'test/09', (code) => {
			assert.equal(1, code);
			done();
		});
	});
	it('should throw an error by file not found', function (done) {
		runIt('', 'test/10', (code) => {
			assert.equal(1, code);
			done();
		});
	});
	it('should throw an error by invalid shortcut', function (done) {
		runIt('shortcutsInvalid', 'test/11', (code) => {
			assert.equal(1, code);
			done();
		});
	});
});
