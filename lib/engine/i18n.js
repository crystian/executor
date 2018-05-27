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
			mergeDeepInvalidObjects: { code: 10,	msg: 'Objects sent to mergeDeep are invalid' },
		},
		environments: {
			invalidFormat: { code: 20,	msg: 'The attribute "environments" should be an array with strings or simple object ({key: value})' },
		},
		packageJson: {
			notFound: { code: 30,	msg: 'Package.json not found on: ${folder}' },
		},
		config: {
			notFound: { code: 40,	msg: '"${fileName}" not found on: ${cwd}' },
			invalidJson: { code: 41,	msg: 'Invalid json format on your configuration file: ${jsonFile}' },
			invalidFormat: { code: 42,	msg: 'An invalid structure on config attribute' },
			isNotAString: { code: 43,	msg: 'An invalid type on configuration file: "configFile" should be a string' },
			isNotAKnownField: { code: 44,	msg: 'Invalid field/s on config: ${fields}' },
			isAReservedField: { code: 45,	msg: '"${field}": Is a reserved word you can not use it' }
		},
		shortcut: {
			withoutArguments: { code: 50,	msg: 'coff coff ... and the "shortcut"?${shortcuts}' }
		},
		shortcuts: {
			notFound: { code: 60,	msg: 'The attribute "shortcuts" should exist and should be an object no empty.' },
			shouldBeAnObject: { code: 61,	msg: 'The attribute "shortcuts" should be an object, and the last attribute on it should be a string.' }
		},
		templates: {
			invalidData: { code: 70,	msg: 'The configurations of templates are invalid, should be an object or string' },
			invalidFormat: { code: 71,	msg: 'Invalid format, remember should be a pair key value \(both should be strings\), key: "${key}"' }, // eslint-disable-line no-useless-escape
		}
	},
	builder: {
		command: {
			dry: '\n[executor] Executing on dry mode, this will be the command line:\n',
			running: 'Running:\n'
		}
	},
	config: {
		used: 'Config file used: "${configFileName}"'
	},
	templates: {
		notFound: 'Key "${template}" not found \(remember the order is important!\)', // eslint-disable-line no-useless-escape
	},
	shortcut: {
		withoutArgumentsAvailableValues: '\nShortcuts configured: ${shortcuts}',
		notFoundFirstShortcut: 'The shortcut: "${shortcut}" not found',
		withoutNextArgument: '"${key}" needs another argument',
		notFound: 'The sub-arguments "${subKey}" from "${key}" does not match with your configuration file.'
	}
};
