const { validateConfig, validateShortcut, validateEnvironments, validateTemplates, validateShortcuts } = require('./validators');
const { setColors, mergeDeep } = require('./utils');
const { getConfigFromSources, getConfigMergedWithDefault } = require('./config');
// const { interpolateVariables } = require('./interpolate');
// const { configDefault } = require('./defaults');
const { messages } = require('./i18n');


/**
 * This is the main and only entry point!
 * the other functions exported by module are for test
 *
 * @param shortcut the command entered by user
 * @returns {*}
 */
let buildCommand = (shortcut) => {
	let configFromSources = buildConfig(getConfigFromSources());
	return buildCommandWithConfig(shortcut, configFromSources);
};


/**
 * This is the main with config for tests
 *
 * @param shortcut the command entered by user
 * @param config from config file
 * @returns {*}
 */
let buildCommandWithConfig = (shortcut, config) => {
	validateConfig(config);

	// config first at all because I need to registry the colors for console
	config = getConfigMergedWithDefault(config);
	setColors(config);

	// validation tasks
	validateShortcut(shortcut, buildShortcutsAvailable(config.shortcuts));
	validateEnvironments(config.environments);
	validateTemplates(config.templates);
	validateShortcuts(config.shortcuts);



	// config.environmentsRendered = validateAndBuildEnvironments(config.environments);

//
// 	// building tasks
// 	config.shortcutsRendered = interpolateVariables(config);
//
// 	let command = buildShortcutCommand(config.shortcutsRendered, shortcut).join(' ');
//
// 	let test = {
// 		showedCommand: false,
// 		dry: false
// 	};
//
// 	if ((config.config.dry || config.config.showCommand)) {
// 		if (config.config.dry) {
// 			test = {
// 				showedCommand: true,
// 				dry: true
// 			};
//
// 			/* istanbul ignore if  */
// 			if (!isTestRunning()) {
// 				console.primary(messages.builder.command.dry);
// 				console.secondary(`${command}`);
// 			}
// 		} else {
// 			test = {
// 				showedCommand: true,
// 				dry: false
// 			};
//
// 			/* istanbul ignore if  */
// 			if (!isTestRunning()) {
// 				console.primary(`[${messages.app.name}]`, messages.builder.command.running);
// 				console.secondary(`${command}\n`);
// 			}
// 		}
// 	}
//
// 	return {
// 		command,
// 		config,
// 		test
// 	};
};


/**
 * This build final config from different sources
 *
 * @param configPreBuilt
 * @returns {string}
 */
const buildConfig = (configPreBuilt) => {
	let r = {};

	let packageJson = configPreBuilt.packageJson;
	let	configFile = configPreBuilt.configFile;
	let	executorFile = configPreBuilt.executorFile;

	//logic of config files from three sources
	if (packageJson && packageJson[messages.app.name]) {
		r = mergeDeep(r, packageJson[messages.app.name]);

		if (configFile) {
			r = mergeDeep(r, configFile);
		} else {
			if (executorFile) {
				r = mergeDeep(r, executorFile);
			}
		}
	} else if (executorFile) {
		r = mergeDeep(r, executorFile);
	}

	delete r.configFile;

	return r;
};

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
	buildCommand,
	buildCommandWithConfig,
	buildConfig,
	buildShortcutsAvailable
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
