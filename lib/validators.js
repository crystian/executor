const { configDefault } = require('./defaults');
const { isObject, isString, isObjectEmpty } = require('./utils');
const { messages } = require('./i18n');


/**
 * validate the input from the cli
 *
 * @param shortcut is the input from the user
 * @param shortcuts a string with extraMessage to concatenate
 */
const validateShortcut = (shortcut, shortcuts) => {
	if (!(shortcut && shortcut !== '' && isString(shortcut))) {
		shortcuts = shortcuts || ' ';
		throw new ExecutorError(messages.errors.shortcut.withoutArguments, { shortcuts });
	}
};


/**
 * simple validation to de config
 *
 * @param config
 */
const validateConfig = (config) => {
	// can be undefined, just it will use the default one
	if (config !== undefined) {
		if (!isObject(config)) {
			throw new ExecutorError(messages.errors.config.invalidFormat);
		}

		if (isObjectEmpty(config)) {
			throw new ExecutorError(messages.errors.config.notFound);
		}

		if (config.executorEmptyFlag) {
			throw new ExecutorError(messages.errors.config.notConfigurationOnFile, { file: config.executorEmptyFlag });
		}

		_validateKnownAndReserved(config);
	}
};

/**
 * validation of known fields and reserved words
 *
 * @param config
 * @private
 */
const _validateKnownAndReserved = (config) => {
	_validateKnownFields(config);
	config.templates && _validateReservedFields(config.templates);
	config.shortcuts && _validateReservedFields(config.shortcuts);
};

/**
 * just first level
 *
 * @param config
 * @private
 */
const _validateKnownFields = (config) => {
	let r = Object.keys(config).filter(item => !configDefault.hasOwnProperty(item));

	if (r.length > 0) {
		throw new ExecutorError(messages.errors.config.isNotAKnownField, { fields: r.join(', ') });
	}
};


/**
 * just for not collide with some keywords
 *
 * @param config
 * @private
 */
const _validateReservedFields = (config) => {
	let reservedWords = ['env', 'def', 'pkg'];

	let r = Object.keys(config).filter(item => {
		return (reservedWords.indexOf(item.toLowerCase()) !== -1);
	});

	if (r.length > 0) {
		throw new ExecutorError(messages.errors.config.isAReservedField, { field: r.join(', ') });
	}
};

/**
 * validation of format of templates
 *
 * @param templates
 */
const validateTemplates = (templates) => {
	if (templates === undefined) {//yes, it's valid
		return;
	}

	if (!isObject(templates)) {
		throw new ExecutorError(messages.errors.templates.invalidData);
	}

	// validating pairs
	Object.keys(templates).forEach(item => {
		let value = templates[item];
		if (isObject(value)) {
			validateTemplates(templates[item]);
		} else if (!isString(value)) {
			throw new ExecutorError(messages.errors.templates.invalidFormat, { key: item, value });
		}

	});
};


/**
 * just for package.json field: configFile
 *
 * @param packageJson
 * @returns {boolean}
 */
let validateConfigFileField = (packageJson) => {
	let r = false;
	if (!packageJson) {
		return r;
	}

	r = _validateConfigFileField(packageJson);

	return r;
};
let _validateConfigFileField = (packageJson) => {
	const appName = messages.app.name;

	let r = false;
	let packageJsonEmpty = (isObjectEmpty(packageJson) && isObjectEmpty(packageJson.config));
	let packageJsonWithoutConfig = (packageJson[appName] && packageJson[appName].configFile);

	if (!packageJsonEmpty && packageJsonWithoutConfig) {
		if (isString(packageJson[appName].configFile)) {
			r = true;
		} else {
			throw new ExecutorError(messages.errors.config.isNotAString);
		}
	}

	return r;
};


/**
 * validation of format of shortcuts
 *
 * @param shortcuts
 */
const validateShortcuts = (shortcuts) => {
	if (!(isObject(shortcuts) && !isObjectEmpty(shortcuts))) {

		throw new ExecutorError(messages.errors.shortcuts.notFound);
	}

	_validateShortcutsRecursive(shortcuts);
};

const _validateShortcutsRecursive = (shortcutsNested) => {
	let keys = Object.keys(shortcutsNested);
	if (keys.length === 0) {
		throw new ExecutorError(messages.errors.shortcuts.shouldBeAnObject);
	}

	keys.forEach((itemName) => {
		let item = shortcutsNested[itemName];

		if (isObject(item)) {
			// nesting detected
			return _validateShortcutsRecursive(item);
		} else if (!isString(item)) {
			// end detected
			throw new ExecutorError(messages.errors.shortcuts.shouldBeAnObject);
		}

	});
};

module.exports = {
	validateShortcut,
	validateConfig,
	validateTemplates,
	validateShortcuts,
	validateConfigFileField
};
