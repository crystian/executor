const { validateAndBuildEnvironments, validateShortcut, validateShortcuts, validateTemplates, validateConfig } = require('./validators');
const { isTestRunning, setColors } = require('./utils');
const { buildInterpolateVariables, buildShortcutCommand, buildConfig } = require('./builders');
const { getConfigFromCWD } = require('./node');
const { configDefault } = require('./defaults');
const { messages } = require('./i18n');


/**
 * This is the main and only entry point!
 * the other functions exported by module are for test
 *
 * @param shortcut the command entered by user
 * @returns {*}
 */
let buildCommand = (shortcut) => {
	return buildCommandWithConfig(shortcut, getConfigFromCWD());
};


/**
 * This is the main with config for tests
 *
 * @param shortcut the command entered by user
 * @param config from config file
 * @returns {*}
 */
let buildCommandWithConfig = (shortcut, config) => {

	// config first at all because I need to registry the colors for console
	config.config = buildConfig(configDefault, config.config);
	setColors(config.config);

	// validation tasks
	let shortcutValid = validateShortcut(shortcut);
	validateConfig(config.config);
	config.environmentsRendered = validateAndBuildEnvironments(config.environments);
	validateTemplates(config.templates);
	validateShortcuts(config.shortcuts);

	if(!shortcutValid) {
		let shortcuts = Object.keys(config.shortcuts).map(item => {
			return `"${item}"`;
		}).join(', ');
		
		throw new Error(messages.shortcut.withoutArguments.toTemplate({shortcuts}));
	}

	// building tasks
	config.shortcutsRendered = buildInterpolateVariables(config);

	let command = buildShortcutCommand(config.shortcutsRendered, shortcut).join(' ');

	let test = {
		showedCommand: false,
		dry: false,
	};

	if ((config.config.dry || config.config.showCommand)) {
		if (config.config.dry) {
			test = {
				showedCommand: true,
				dry: true,
			};

			/* istanbul ignore if  */
			if (!isTestRunning()) {
				console.primary(messages.builder.command.dry);
				console.secondary(`${command}`);
			}
		} else {
			test = {
				showedCommand: true,
				dry: false,
			};

			/* istanbul ignore if  */
			if (!isTestRunning()) {
				console.primary(`[${messages.app.name}]`, messages.builder.command.running);
				console.secondary(`${command}\n`);
			}
		}
	}

	return {
		command,
		config,
		test
	};
};


module.exports = {
	buildCommand,
	buildCommandWithConfig
};
