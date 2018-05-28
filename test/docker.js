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

	function dockerRun(done) {
		spawn('docker', 'run --init -d --rm -i --name executor executor'.split(' '), spawnOption)
			.on('exit', (code) => {
				if (code === 0) {
					done();
				} else {
					throw new Error('Error on RUN image on docker, check the stack please');
				}

			});
	}

	function dockerBuild(done) {
		// return dockerRun(done);
		spawn('docker', 'build -f Dockerfile -t executor .'.split(' '), spawnOption)
			.on('exit', (code) => {

				if (code === 0) {
					dockerRun(done);
				} else {
					throw new Error('Error on BUILD image on docker, check the stack please');
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
		spawn('docker', `exec executor ash -c "cd ${cwd} && /npm-global/bin/e ${command}"`.split(' '), spawnOption)
			.on('exit', (code) => {
				done(code);
			});
	}

	it('should throw an error by file not found: executor.json', function(done) {
		runIt('', 'test/01', (code) => {
			assert.equal(1, code);
			done();
		});
	});

// 	it('should not throw an error by read the executor.json on the fixture folder', function(done) {
// 		runIt('', 'test/00', (code) => {
// 			assert.equal(1, code);
// 			done();
// 		});
// 	});
//
// 	it('should NOT throw an error by read the executor.json on the fixture folder', function(done) {
// 		runIt('hello', 'test/00', (code) => {
// 			assert.equal(0, code);
// 			done();
// 		});
// 	});
//
// 	it('should throw an error by configuration on package.json is not a string: {}', function(done) {
// 		runIt('', 'test/03', (code) => {
// 			assert.equal(1, code);
// 			done();
// 		});
// 	});
//
// 	it('should throw an error by configuration on package.json is not a string: 1', function(done) {
// 		runIt('', 'test/04', (code) => {
// 			assert.equal(1, code);
// 			done();
// 		});
// 	});
//
// 	it('should throw an error by configuration on package.json is a string and point to a not exist file', function(done) {
// 		runIt('', 'test/08', (code) => {
// 			assert.equal(1, code);
// 			done();
// 		});
// 	});
//
// 	it('should read the configuration file on fixture/05: other configuration file', function(done) {
// 		runIt('hello', 'test/05', (code) => {
// 			assert.equal(0, code);
// 			done();
// 		});
// 	});
//
// 	it('should read the configuration file on fixture/06: other configuration file in another folder', function(done) {
// 		runIt('hello', 'test/06', (code) => {
// 			assert.equal(0, code);
// 			done();
// 		});
// 	});
//
// 	it('should throw an error by the configuration file on fixture/05 does not exist', function(done) {
// 		runIt('hello', 'test/08', (code) => {
// 			assert.equal(1, code);
// 			done();
// 		});
// 	});
//
// 	it('should works with a complex case', function(done) {
// 		runIt('short2 short22', 'test/09', (code) => {
// 			assert.equal(0, code);
// 			done();
// 		});
// 	});
//
});
