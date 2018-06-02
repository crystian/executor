const path = require('path');
const { setColors } = require('./extends');
const { validateConfig, validateShortcut, validateTemplates, validateShortcuts } = require('./validators');
const { mergeDeep, isObject, isTestRunning, isObjectEmpty } = require('./utils');
const { getConfigFromSources, getConfigMergedWithDefault, getConfigFromJson } = require('./config');
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
	let configFromSources = getConfigFromSources();
	let config = buildConfig(configFromSources);
	return buildCommandWithConfig(shortcut, config, configFromSources.packageJson);
};


/**
 * This is the main with config for tests
 *
 * @param shortcut the command entered by user
 * @param config from config file
 * @param packageJson
 * @returns {*}
 */
let buildCommandWithConfig = (shortcut, config, packageJson) => {

	// hello case
	if (shortcut === 'hello') {
		let helloConfig = _getHelloConfig();
		config = getConfigMergedWithDefault(mergeDeep(helloConfig, config));
	}

	// VALIDATE INPUTS:
	validateConfig(config);
	validateShortcut(shortcut, buildShortcutsAvailable(config.shortcuts));

	// config first at all because I need to registry the colors for console
	config = getConfigMergedWithDefault(config);
	setColors(config);

	// validation tasks
	validateTemplates(config.templates);
	validateShortcuts(config.shortcuts);

	// building tasks
	config.shortcutsRendered = interpolateConfigVariables(config, packageJson);
	let command = buildShortcutCommand(config.shortcutsRendered, shortcut).join(' ');

	let ui = resolveShowCommandOnConsole(config, command);

	return {
		command,
		config,
		ui
	};
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

	// logic of config files from three sources
	// TODO improve it!
	if (packageJson && packageJson[messages.app.name]) {
		r = mergeDeep(r, packageJson[messages.app.name]);

		if (configFile) {
			r = _merge(configFile, configPreBuilt.configFileName, r);
		} else {
			if (executorFile) {
				r = _merge(executorFile, configPreBuilt.executorFileName, r);
			}
		}
	} else if (executorFile) {
		r = _merge(executorFile, configPreBuilt.executorFileName, r);
	}

	delete r.configFile;

	return r;
};

/**
 * #mutable
 *
 * @param file
 * @param name
 * @param result
 * @returns {*}
 * @private
 */
const _merge = (file, name, result) => {
	file.executorEmptyFlag = isObjectEmpty(file) ? name : false; // just for not show an error to the user
	return mergeDeep(result, file);
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


/**
 *
 * @returns {{showCommand: boolean, shortcuts: {hello: string}}}
 * @private
 */
function _getHelloConfig() {
	let configJsonPath = path.resolve(__dirname, '../');
	let pkg = getConfigFromJson(configJsonPath, 'package.json'); // from global executor
	/* istanbul ignore next */
	let v = (pkg && pkg.version) ? pkg.version : '?.?.?';
	let msg = [];
	let line = '═'.repeat(v.length+1);

	msg.push(`╔══════════════════╦════════════════════════${line}╗`);
	msg.push(`║ - HELLO WORLD! - ║ Executor installed! v: ${ v } ║`);
	msg.push(`╚══════════════════╩════════════════════════${line}╝`);
	return {
		showCommand: false,
		shortcuts: {
			hello: 'echo ' + msg.join(' &&echo ')
		}
	};
}


module.exports = {
	buildCommand,
	buildCommandWithConfig,
	resolveShowCommandOnConsole,
	buildShortcutCommand,
	buildConfig,
	buildShortcutsAvailable
};


