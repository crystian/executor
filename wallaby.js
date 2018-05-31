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
			'test/**/.gitkeep'
		],
		tests: [
			'test/**/*.spec.js'
		],
		setup: function() {
			require('./lib/extends');
		},
		debug: false
	};
};
