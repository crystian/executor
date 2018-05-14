const { isObject, isString, isObjectEmpty } = require('./utils');
const { messages } = require('./i18n');

/**
 * validate the input from the cli
 *
 * @param shortcut is the input from the user
 * @param possibilities a string with possibilities to concatenate
 */
const validateShortcut = (shortcut, possibilities) => {
	if (!(shortcut && shortcut !== '' && isString(shortcut))) {
		possibilities = possibilities || '';
		throw new Error(messages.shortcut.withoutArguments + possibilities);
	}
};


/**
 * simple validation to de config
 *
 * @param config
 */
const validateConfig = (config) => {
	// can be null, just it will use the default one
	if (config === undefined) {
		return;
	}
	if (!isObject(config)) {
		throw new Error(messages.config.invalidFormat);
	}
};


/**
 * validation the environment attribute and interpolate with values on a format for use on next steps
 *
 * @param environments
 * @returns {Array}
 */
const validateAndBuildEnvironments = (environments) => {
	if (environments) {
		let newEnvironment = [];
		if (Array.isArray(environments)) {
			environments.forEach(item => {

				// more lines, but more legible:

				if (!item) {
					return;
				}
				if (isString(item)) {
					// with the appropriated format for parse it
					let newItem = {};
					newItem[item] = item;
					newEnvironment.push(newItem);
					return;
				}

				if (isObject(item)) {

					let keys = Object.keys(item);

					if ((keys.length === 1 && isString(item[keys[0]]))) {
						newEnvironment.push(item);
					} else {
						throw new Error(messages.environments.invalidFormat);
					}
				} else {
					throw new Error(messages.environments.invalidFormat);
				}
			});
		} else {
			throw new Error(messages.environments.invalidFormat);
		}

		return newEnvironment;
	}
};


/**
 * validation of format of templates
 *
 * @param templates
 */
const validateTemplates = (templates) => {
	if (templates === undefined) {
		return;
	}
	if (!isObject(templates)) {
		throw new Error(messages.templates.invalidData);
	}

	// validating pairs
	Object.keys(templates).forEach(item => {
		let value = templates[item];
		if (isObject(value)) {
			validateTemplates(templates[item]);
		} else if (!isString(value)) {
			throw new Error(messages.templates.invalidFormat.toTemplate({ key: item, value }));
		}
	});

};


/**
 * validation of format of shortcuts
 *
 * @param shortcuts
 */
const validateShortcuts = (shortcuts) => {
	if (!(isObject(shortcuts) && !isObjectEmpty(shortcuts))) {
		throw new Error(messages.shortcuts.notFound);
	}

	_validateShortcutsRecursive(shortcuts);
};

const _validateShortcutsRecursive = (shortcutsNested) => {
	let keys = Object.keys(shortcutsNested);
	if (keys.length === 0) {
		throw new Error(messages.shortcuts.shouldBeAnObject);
	}
	keys.forEach((itemName) => {
		let item = shortcutsNested[itemName];

		if (isObject(item)) { // nesting detected
			return _validateShortcutsRecursive(item);
		} else if (!isString(item)) { // end detected
			throw new Error(messages.shortcuts.shouldBeAnObject);
		}
	});
};


module.exports = {
	validateShortcut,
	validateConfig,
	validateAndBuildEnvironments,
	validateTemplates,
	validateShortcuts
};

