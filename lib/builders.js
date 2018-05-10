const { mergeDeep, isObject, isObjectEmpty, isString } = require('./utils');
const { predefined } = require('./defaults');
const { messages } = require('./i18n');

/**
 * Merge between default and from the config file
 *
 * @param configDefault
 * @param config
 * @returns {*}
 */
const buildConfig = (configDefault, config) => {
	return mergeDeep(configDefault, config);
};


/**
 * This build the command line joining all pieces recursively
 *
 * @param shortcuts
 * @param shortcut
 * @returns {string}
 */
const buildShortcutCommand = (shortcuts, shortcut) => {
	shortcut = shortcut.split(' ');
	let log = messages.shortcut.notFoundFirstShortcut.toTemplate({shortcut}) + buildShortcutPossibilities(shortcuts),
		command = _buildShortcutRecursive(shortcuts, shortcut, log);

	// this add final arguments to the command line
	command = command.split(' ').concat(shortcut);
	return command;
};

/**
 * This build the possibilities to use for output to user
 *
 * @param shortcuts
 * @returns {string}
 */
const buildShortcutPossibilities = (shortcuts) => {
	let r = '';

	if (shortcuts) {
		let shortcutsMap = Object.keys(shortcuts).map(item => {
			return `"${item}"`;
		});

		if (shortcutsMap.length > 0) {
			r = messages.shortcut.withoutArgumentsPossibleValues.toTemplate({ shortcuts: shortcutsMap.join(', ') });
		}
	}
	
	return r;
};

/**
 * The recursive method to chain the shortcut with its templates
 *
 * @param shortcuts list of shortcuts posibles
 * @param shortcut the actual shortcut
 * @param log to show for the user if it fail
 * @returns {*}
 * @private
 */
const _buildShortcutRecursive = (shortcuts, shortcut, log) => {
	let key = shortcut.shift(),
		found = shortcuts[key];

	if (!found) {
		throw new Error(log);
	} else if (isObject(found)) {

		let log = messages.shortcut.notFound.toTemplate({ key });


		return _buildShortcutRecursive(found, shortcut, log + buildShortcutPossibilities(found));
	}

	return found;
};


module.exports = {
	buildConfig,
	buildShortcutCommand,
	buildShortcutPossibilities
};
