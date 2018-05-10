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
 * Interpolate all the inputs!
 *
 * Inputs in order: environment, predefined, template, shortcut
 * And it allow to use nested object! (not for environment)
 *
 * Note: it can be changed to get better performance.
 *
 * @param config
 * @returns {any}
 */
const buildInterpolateVariables = (config) => {
	let shortcuts = config.shortcuts,
		templates = config.templates || {},
		environments = config.environmentsRendered || [],
		newShortcuts, newTemplates, newEnvironments;

	if (!shortcuts) {
		throw new Error(messages.shortcuts.notFound);
	}

	// copy structure to mutate in the easy way
	newShortcuts = JSON.parse(JSON.stringify(shortcuts));
	newTemplates = JSON.parse(JSON.stringify(templates));

	newEnvironments = _buildInterpolateEnvironmentVars(environments);

	// This is recursive and it is needed to pass on each stage
	// to template
	_buildInterpolateVariablesRecursive(newTemplates, newEnvironments);
	_buildInterpolateVariablesRecursive(newTemplates, { predefined });
	_buildInterpolateVariablesRecursive(newTemplates, newTemplates); // yes to itself!
	// to shortcuts
	_buildInterpolateVariablesRecursive(newShortcuts, newEnvironments);
	_buildInterpolateVariablesRecursive(newShortcuts, { predefined });
	_buildInterpolateVariablesRecursive(newShortcuts, newTemplates);
	_buildInterpolateVariablesRecursive(newShortcuts, newShortcuts, true); // yes to itself!

	return newShortcuts;
};

/**
 * It gets data from the external environment, and prepare it to use.
 *
 * @param environments
 * @private
 */
const _buildInterpolateEnvironmentVars = (environments) => {
	let environmentsToReturn = {};

	environments.forEach(item => {
		let key = Object.keys(item)[0];
		environmentsToReturn[key] = process.env[item[key]];
	});

	return environmentsToReturn;
};

/**
 * It does the magic recursively to replace the placeholders with values, even itself
 *
 * @param values are the data and you can use it so simple or you can mix with templates (by placeholders)
 * @param templates are the reuse "snippet", you can use it on values and avoid to repeat your code!
 * @param finalFlag at the final it will check if there are some placeholders without replaced
 * @private
 */
const _buildInterpolateVariablesRecursive = (values, templates, finalFlag) => {

	Object.keys(values).forEach(item => {

		// be careful, it is a mutable object
		if (isString(values[item])) {
			values[item] = values[item].toTemplate(templates);

			if (finalFlag && values[item].match(/\${.+?}/g)) {
				throw new Error(messages.templates.notFound.toTemplate({ template: values[item] }));
			}
		} else if (isObject(values[item]) && !isObjectEmpty(values[item])) {
			_buildInterpolateVariablesRecursive(values[item], templates, finalFlag);
		} else {
			throw new Error(messages.templates.invalidFormat.toTemplate({ key: item, value: values[item] }));
		}
	});
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
	buildInterpolateVariables,
	buildShortcutCommand,
	buildShortcutPossibilities
};
