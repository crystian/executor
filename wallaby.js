// this configuration is a nice plugin for your ide
// https://wallabyjs.com
module.exports = function() {
	return {
		env: {
			type: 'node',
			runner: 'node'
		},
		testFramework: 'mocha',
		files: [
			'lib/**/*.js',
			'test/**/*.json',
			'!lib/**/*.spec.js'
		],
		tests: [
			'lib/**/*.spec.js'
		],
		setup: function() {
			require('./lib/engine/extends');
		},
		debug: false
	};
};
