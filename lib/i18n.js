/**
 * All messages to user.
 * The idea is not to translate, just for save all in one place.
 *
 * @type {*}
 */
module.exports.messages = {
	app: {
		name: 'executor'
	},
	errors: {
		global: {
			mergeDeepInvalidObjects: { code: 10, msg: 'Objects sent to mergeDeep are invalid' }
		},
		environments: {
			invalidFormat: { code: 20, msg: 'The attribute "environments" should be an array with strings or simple object ({key: value})' }
		},
		config: {
			notFound: { code: 404, msg: 'Configuration not found. (readme: https://github.com/crystian/executor)' },
			notConfigurationOnFile: { code: 40, msg: 'Configuration not found on "${file}"' },
			internalNotFound: { code: 41, msg: '"${fileName}" not found on: ${cwd}' },
			invalidJson: { code: 42, msg: 'Invalid json format on your configuration file: ${jsonFile}' },
			invalidFormat: { code: 43, msg: 'An invalid structure on config attribute' },
			isNotAString: { code: 44, msg: 'An invalid type on configuration file: "configFile" should be a string' },
			isNotAKnownField: { code: 45, msg: 'Invalid field/s on config: "${fields}"' },
			isAReservedField: { code: 46, msg: '"${field}": Is a reserved word you can not use it' }
		},
		shortcut: {
			withoutArguments: { code: 50, msg: 'coff coff ... and the "shortcut"?${shortcuts}' },
			notFoundFirstShortcut: { code: 51, msg: 'The shortcut: "${shortcut}" not found ${extraMessage}' },
			notFound: { code: 52, msg: 'The sub-arguments "${subKey}" from "${key}" does not match with your configuration file. ${extraMessage}' },
			withoutNextArgument: { code: 52, msg: '"${key}" needs another argument. ${extraMessage}' }
		},
		shortcuts: {
			notFound: { code: 60, msg: 'The attribute "shortcuts" should exist and should be an object no empty.' },
			shouldBeAnObject: { code: 61, msg: 'The attribute "shortcuts" should be an object, and the last attribute on it should be a string.' }
		},
		templates: {
			notFound: { code: 70, msg: 'Key "${template}" not found \(remember the order is important!\)' }, // eslint-disable-line no-useless-escape
			invalidData: { code: 71, msg: 'The configurations of templates are invalid, should be an object or string' },
			invalidFormat: { code: 72, msg: 'Invalid format, remember should be a pair key value \(both should be strings\), key: "${key}"' } // eslint-disable-line
			// no-useless-escape
		}
	},
	builder: {
		command: {
			dry: 'Executing on dry mode, this will be the command line:\n',
			running: 'Running:\n'
		}
	},
	config: {
		used: 'Config file used: "${configFileName}"'
	},
	shortcut: {
		withoutArgumentsAvailableValues: '\nShortcuts configured: ${shortcuts}'
	}
};
