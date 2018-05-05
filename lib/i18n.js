/**
 * All messages to user.
 * The idea is not to translate, just for save all in one place.
 *
 * @type {*}
 */
const messages = {
	app: {
		name: 'executor'
	},
	builder: {
		required: '!the shortcut string and the config are required',
		command: {
			dry: '\n[executor] Executing on mode dry, this will be the command line:\n',
			running: 'Running:\n'
		}
	},
	environments: {
		invalidFormat: '[environments] The attribute "environments" should be an array with strings or simple object {key: value}, check it'
	},
	config: {
		notFound: 'File not found: "${fileName}"',
		used: '[config] Config file used: "${configFileName}"',
		invalidFormat: '[config] Invalid structure on config attribute',
		invalidJson: '[config] Invalid json format on your configuration file: ${jsonFile}',
		isNotAString: '[config] Invalid type on configuration file: "configFile" should be a string'
	},
	templates: {
		notFound: '[template] Key "${template}" not found (remember the order is important!)',
		invalidData: '[template] The configurations of templates is invalid, should be an object or string',
		invalidFormat: '[template] Invalid format, remember should be a pair key value (both should be string): "${key}": "${value}"'
	},
	shortcuts: {
		notFound: '[shortcuts] The attribute "shortcuts" should be exist and should be an object no empty',
		shouldBeAnObject: '[shortcuts] The attribute "shortcuts" should be an object and the last attribute on it should be an string'
	},
	shortcut: {
		withoutArguments: '[argument] coff coff ... and the "shortcut"?',
		notFoundFirstShortcut: '[argument] The "shortcut" does not found, check your spelling or your configuration file',
		notFound: '[argument] The sub-arguments from "${key}" do not match with your configuration file, for your key you have the following arguments: '
	}
};

module.exports = {
	messages
};

