const { mergeDeep, isObject } = require('./utils');
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


// /**
//  * The recursive method to chain the shortcut with its templates
//  *
//  * @param shortcuts list of shortcuts posibles
//  * @param shortcut the actual shortcut
//  * @param log to show for the user if it fail
//  * @returns {*}
//  * @private
//  */
// const _buildShortcutRecursive = (shortcuts, shortcut, log) => {
// 	let key = shortcut.shift(),
// 		found = shortcuts[key];
//
// 	if (!found) {
// 		throw new Error(log);
// 	} else if (isObject(found)) {
// 		let log = '';
// 		if (shortcut.length === 0) {
// 			log = messages.shortcut.withoutNextArgument.toTemplate({ key });
// 		} else {
// 			log = messages.shortcut.notFound.toTemplate({ key, subKey: shortcut });
// 		}
//
// 		return _buildShortcutRecursive(found, shortcut, log + buildShortcutsAvailable(found));
// 	}
//
// 	return found;
// };
//
//
// /**
//  * This build the command line joining all pieces recursively
//  *
//  * @param shortcuts
//  * @param shortcut
//  * @returns {string}
//  */
// const buildShortcutCommand = (shortcuts, shortcut) => {
// 	shortcut = shortcut.split(' ');
// 	let log = messages.shortcut.notFoundFirstShortcut.toTemplate({ shortcut }) + buildShortcutsAvailable(shortcuts),
// 		command = _buildShortcutRecursive(shortcuts, shortcut, log);
//
// 	// this add final arguments to the command line
// 	command = command.split(' ').concat(shortcut);
// 	return command;
// };

/**
 * This build the possibilities to use for output to user
 *
 * @param shortcuts
 * @returns {string}
 */
const buildShortcutsAvailable = (shortcuts) => {
	let r = '';

	if (shortcuts) {
		let shortcutsMap = Object.keys(shortcuts).map(item => `"${item}"`);

		if (shortcutsMap.length > 0) {
			r = messages.shortcut.withoutArgumentsAvailableValues.toTemplate({ shortcuts: shortcutsMap.join(', ') });
		}
	}

	return r;
};


module.exports = {
	buildConfig,
	// buildShortcutCommand,
	buildShortcutsAvailable
};


// const validateAndBuildEnvironments = (environments) => {
// 	if (environments) {
// 		let newEnvironment = [];
// 		if (Array.isArray(environments)) {
// 			environments.forEach(item => {
//
// 				// more lines, but more legible:
//
// 				if (!item) {
// 					return;
// 				}
//
// 				if (isString(item)) {
// 					// with the appropriated format for parse it
// 					let newItem = {};
// 					newItem[item] = item;
// 					newEnvironment.push(newItem);
// 					return;
// 				}
//
// 				if (isObject(item)) {
//
// 					let keys = Object.keys(item);
//
// 					if ((keys.length === 1 && isString(item[keys[0]]))) {
// 						newEnvironment.push(item);
// 					} else {
// 						throw new Error(messages.environments.invalidFormat);
// 					}
//
// 				} else {
// 					throw new Error(messages.environments.invalidFormat);
// 				}
// 			});
// 		} else {
// 			throw new Error(messages.environments.invalidFormat);
// 		}
//
//
// 		return newEnvironment;
// 	}
// };
