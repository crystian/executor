const { isObject, isObjectEmpty, isString } = require('./utils');
const { predefined } = require('./defaults');
const { messages } = require('./i18n');


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
const interpolateVariables = (config) => {
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
	_interpolateVariablesRecursive(newTemplates, newEnvironments);
	_interpolateVariablesRecursive(newTemplates, { predefined });
	_interpolateVariablesRecursive(newTemplates, newTemplates); // yes to itself!
	// to shortcuts
	_interpolateVariablesRecursive(newShortcuts, newEnvironments);
	_interpolateVariablesRecursive(newShortcuts, { predefined });
	_interpolateVariablesRecursive(newShortcuts, newTemplates);
	_interpolateVariablesRecursive(newShortcuts, newShortcuts, true); // yes to itself!

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
const _interpolateVariablesRecursive = (values, templates, finalFlag) => {

	Object.keys(values).forEach(item => {

		// be careful, it is a mutable object
		if (isString(values[item])) {
			values[item] = values[item].toTemplate(templates);

			if (finalFlag && values[item].match(/\${.+?}/g)) {
				throw new Error(messages.templates.notFound.toTemplate({ template: values[item] }));
			}
		} else if (isObject(values[item]) && !isObjectEmpty(values[item])) {
			_interpolateVariablesRecursive(values[item], templates, finalFlag);
		} else {
			throw new Error(messages.templates.invalidFormat.toTemplate({ key: item }));
		}
	});
};


module.exports = {
	interpolateVariables
};
