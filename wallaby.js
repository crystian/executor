// this configuration is a nice plugin for your ide
// https://wallabyjs.com
module.exports = function(wallaby) {
	return {
		env: {
			type: 'node'
		},
		testFramework: 'mocha',
		files: [
			'lib/**/*.js'
		],
		tests: [
			'test/*.spec.js',
			'!test/node.spec.js' // because there are relative paths and the context is different
		]
	};
};
