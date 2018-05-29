const { setColors } = require('./extends');
const { validateConfig, validateShortcut, validateEnvironments, validateTemplates, validateShortcuts } = require('./validators');
const { mergeDeep, isString, isObject, isTestRunning, isObjectEmpty } = require('./utils');
const { getConfigFromSources, getConfigMergedWithDefault } = require('./config');
const { interpolateConfigVariables } = require('./interpolate');
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

	// VALIDATE INPUTS:
	validateConfig(config);
	validateShortcut(shortcut, buildShortcutsAvailable(config.shortcuts));

	// config first at all because I need to registry the colors for console
	config = getConfigMergedWithDefault(config);
	setColors(config);

	// validation tasks
	validateEnvironments(config.environments);
	validateTemplates(config.templates);
	validateShortcuts(config.shortcuts);

	// building tasks
	config.environmentsRendered = buildInterpolateEnvironmentVars(buildEnvironments(config.environments));
	config.shortcutsRendered = interpolateConfigVariables(config);
	let command = buildShortcutCommand(config.shortcutsRendered, shortcut).join(' ');

	let ui = resolveShowCommandOnConsole(config, command);

	return {
		command,
		config,
		ui
	};
};


/**
 * It gets data from the external environment, and prepare it to use.
 *
 * @param environments
 * @private
 */
const buildInterpolateEnvironmentVars = (environments) => {
	let environmentsToReturn = {};

	environments.forEach(item => {
		let key = Object.keys(item)[0];
		environmentsToReturn[key] = process.env[item[key]];
	});

	return environmentsToReturn;
};

/**
 * resolve if show to the user info about the command executed
 *
 * @param config
 * @param command
 * @returns {{showedCommand: boolean, dry: boolean}}
 */
const resolveShowCommandOnConsole = (config, command) => {

	let ui = {
		showedCommand: false,
		dry: false
	};

	if (config.dry || config.showCommand) {
		if (config.dry) {
			ui = {
				showedCommand: true,
				dry: true
			};

			/* istanbul ignore if  */
			if (!isTestRunning()) {
				console.primary(messages.builder.command.dry);
				console.secondary(`${command}`);
			}
		} else {
			ui = {
				showedCommand: true,
				dry: false
			};

			/* istanbul ignore if  */
			if (!isTestRunning()) {
				console.primary(`[${messages.app.name}]`, messages.builder.command.running);
				console.secondary(`${command}\n`);
			}
		}
	}

	return ui;
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
		throw new ExecutorError(log.msg, log.templates);
	} else if (isObject(found)) {
		let log = {};
		if (shortcut.length === 0) {
			log = {
				msg: messages.errors.shortcut.withoutNextArgument,
				templates: { key, extraMessage: buildShortcutsAvailable(found) }
			};
		} else {
			log = {
				msg: messages.errors.shortcut.notFound,
				templates: { key, subKey: shortcut[0], extraMessage: buildShortcutsAvailable(found) }
			};
		}

		return _buildShortcutRecursive(found, shortcut, log);
	}

	return found;
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
	// shortcut
	let log = {
		msg: messages.errors.shortcut.notFoundFirstShortcut,
		templates: { shortcut: shortcut[0], extraMessage: buildShortcutsAvailable(shortcuts) }
	};

	let command = _buildShortcutRecursive(shortcuts, shortcut, log);

	// this add final arguments to the command line
	command = command.split(' ').concat(shortcut);
	return command;
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
	let configFile = configPreBuilt.configFile;
	let executorFile = configPreBuilt.executorFile;

	//logic of config files from three sources
	if (packageJson && packageJson[messages.app.name]) {
		r = mergeDeep(r, packageJson[messages.app.name]);

		if (configFile) {
			r = mergeDeep(r, configFile);
		} else {
			if (executorFile) {
				executorFile.executorEmptyFlag = isObjectEmpty(executorFile); // just for not show an error to the user
				r = mergeDeep(r, executorFile);
			}
		}
	} else if (executorFile) {
		executorFile.executorEmptyFlag = isObjectEmpty(executorFile); // just for not show an error to the user
		r = mergeDeep(r, executorFile);
	}

	delete r.configFile;

	return r;
};

/**
 * auto-descriptive :)
 *
 * @param environments
 * @returns {Array}
 */
const buildEnvironments = (environments) => {
	let newEnvironment = [];
	if (environments) {
		newEnvironment = environments.map(item => {

			if (isString(item)) {
				// with the appropriated format for parse it
				let newItem = {};
				newItem[item] = item;
				item = newItem;
			}

			return item;
		});
	}

	return newEnvironment;
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
	buildInterpolateEnvironmentVars,
	resolveShowCommandOnConsole,
	buildShortcutCommand,
	buildEnvironments,
	buildConfig,
	buildShortcutsAvailable
};


