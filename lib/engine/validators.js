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
	// can be null, just it will use the default one
	_validateObjectAndUndefined(config, messages.errors.config.invalidFormat);
};


/**
 * validation of format of templates
 *
 * @param templates
 */
const validateTemplates = (templates) => {
	let r = _validateObjectAndUndefined(templates, messages.errors.templates.invalidData);
	if (r) {
		return;
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

const _validateObjectAndUndefined = (object, errorMessage) => {
	if (object === undefined) {
		return true;
	}

	if (!isObject(object)) {
		throw new ExecutorError(errorMessage);
	}
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


/**
 * validation the environment attribute and interpolate with values on a format for use on next steps
 *
 * @param environments
 * @returns {Array}
 */
const validateEnvironments = (environments) => {
	if (environments) {
		let newEnvironment = [];

		if (!Array.isArray(environments)) {
			throw new ExecutorError(messages.errors.environments.invalidFormat);
		}

		environments.forEach(item => {

			// more lines, but more legible:

			if (!item) {
				return;
			}

			if (isString(item)) {
				return;
			}

			if (!isObject(item)) {
				throw new ExecutorError(messages.errors.environments.invalidFormat);
			}

			let keys = Object.keys(item);

			if (!((keys.length === 1 && isString(item[keys[0]])))) {
				throw new ExecutorError(messages.errors.environments.invalidFormat);
			}

		});

		return newEnvironment;
	}
};


module.exports = {
	validateShortcut,
	validateConfig,
	validateEnvironments,
	validateTemplates,
	validateShortcuts
};

