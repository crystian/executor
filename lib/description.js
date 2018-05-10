const { validateAndBuildEnvironments, validateShortcut, validateShortcuts, validateTemplates, validateConfig } = require('./validators');
const { isTestRunning, setColors } = require('./utils');
const { interpolateVariables, buildShortcutCommand, buildConfig } = require('./builders');
const { getConfigFromCWD } = require('./node');
const { configDefault } = require('./defaults');
const { messages } = require('./i18n');


let buildCommand = (shortcut) => {
	return buildCommandWithConfig(shortcut, getConfigFromCWD());
};



module.exports = {
	buildCommand,
	buildCommandWithConfig
};
