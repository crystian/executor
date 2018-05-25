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
	global: {
		mergeDeepInvalidObjects: 'Objects sent to mergeDeep are invalid'
	},
	builder: {
		command: {
			dry: '\n[executor] Executing on dry mode, this will be the command line:\n',
			running: 'Running:\n'
		}
	},
	environments: {
		invalidFormat: 'The attribute "environments" should be an array with strings or simple object ({key: value})'
	},
	config: {
		notFound: '"${fileName}" or "package.json" with config not found in this folder',
		used: 'Config file used: "${configFileName}"',
		invalidFormat: 'An invalid structure on config attribute',
		invalidJson: 'Invalid json format on your configuration file: ${jsonFile}',
		isNotAString: 'An invalid type on configuration file: "configFile" should be a string'
	},
	templates: {
		notFound: 'Key "${template}" not found \(remember the order is important!\)', // eslint-disable-line no-useless-escape
		invalidData: 'The configurations of templates are invalid, should be an object or string',
		invalidFormat: 'Invalid format, remember should be a pair key value \(both should be strings\), key: "${key}"' // eslint-disable-line no-useless-escape
	},
	shortcuts: {
		notFound: 'The attribute "shortcuts" should exist and should be an object no empty.',
		shouldBeAnObject: 'The attribute "shortcuts" should be an object, and the last attribute on it should be a string.'
	},
	shortcut: {
		withoutArguments: 'coff coff ... and the "shortcut"?',
		withoutArgumentsPossibleValues: '\nShortcuts configured: ${shortcuts}',
		notFoundFirstShortcut: 'The shortcut: "${shortcut}" not found',
		withoutNextArgument: '"${key}" needs another argument',
		notFound: 'The sub-arguments "${subKey}" from "${key}" does not match with your configuration file.'
	}
};
