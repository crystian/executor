// this configuration is a nice plugin for your ide
// https://wallabyjs.com
module.exports = function() {
	return {
		env: {
			type: 'node'
		},
		testFramework: 'mocha',
		files: [
			'lib/**/*.js',
			'test/**/*.json',
			'!lib/**/*.spec.js'
		],
		tests: [
			'lib/**/*.spec.js'
		]
		// setup: function(wallaby) {},
		// debug: false
	};
};
