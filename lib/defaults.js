/**
 * In this module will have all default configuration for the project.
 *
 * @type {*}
 */

const { getAbsoluteCWD } = require('./utils');

module.exports = {
	configDefault: {
		colors: {
			primary: '\x1b[37m%s\x1b[0m', //'\x1b[37m%s\x1b[0m'
			secondary: '\x1b[1m\x1b[36m%s\x1b[0m',
			alert: '\x1b[1m\x1b[31m%s\x1b[0m'
		},
		useColors: true,
		showCommand: true,
		showTime: true,
		dry: false,
		templates: {},
		shortcuts: {},
		executorEmptyFlag: false,
		environments: []
	},
	predefined: {
		cwd: getAbsoluteCWD(),
		executorVersion: 'v'
	}
};
