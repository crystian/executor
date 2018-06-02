const { isObject, isObjectEmpty, isString } = require('./utils');
const { def } = require('./defaults');
const { messages } = require('./i18n');


/**
 * Interpolate all the inputs!
 *
 * Inputs in order: environment, preDEFined, template, shortcut
 * And it allow to use nested object! (not for environments)
 *
 * Note: it can be changed to get better performance.
 *
 * @param config
 * @returns {any}
 */
const interpolateConfigVariables = (config) => {
	let shortcuts = config.shortcuts,
		templates = config.templates,
		newShortcuts, newTemplates;

	// copy structure to mutate in the easy way
	newShortcuts = JSON.parse(JSON.stringify(shortcuts));
	newTemplates = JSON.parse(JSON.stringify(templates));


	// This is recursive and it is needed to pass on each stage
	// to template
	interpolateVariablesRecursive(newTemplates, { env: process.env });
	interpolateVariablesRecursive(newTemplates, { def });
	interpolateVariablesRecursive(newTemplates, newTemplates); // yes to itself!
	// to shortcuts
	interpolateVariablesRecursive(newShortcuts, { env: process.env });
	interpolateVariablesRecursive(newShortcuts, { def });
	interpolateVariablesRecursive(newShortcuts, newTemplates);
	interpolateVariablesRecursive(newShortcuts, newShortcuts, true); // yes to itself!

	return newShortcuts;
};


/**
 * It does the magic recursively to replace the placeholders with target, even ITSELF (mutable)
 *
 * Be careful value is mutable!
 *
 * @param target are the data and you can use it so simple or you can mix with source (by placeholders)
 * @param source are the reuse "snippet", you can use it on target and avoid to repeat your code!
 * @param finalFlag at the final it will check if there are some placeholders without replaced
 * @private
 */
const interpolateVariablesRecursive = (target, source, finalFlag) => {

	Object.keys(target).forEach(item => {

		// be careful, it is a mutable object
		if (isString(target[item])) {

			target[item] = target[item].toTemplate(source);

			if (finalFlag && target[item].match(/\${.+?}/g)) {
				throw new ExecutorError(messages.errors.templates.notFound, { template: target[item].match(/\${.+?}/g) });
			}
		} else if (isObject(target[item]) && !isObjectEmpty(target[item])) {
			interpolateVariablesRecursive(target[item], source, finalFlag);
		} else {
			throw new ExecutorError(messages.errors.templates.invalidFormat, { key: item });
		}
	});
};


module.exports = {
	interpolateConfigVariables,
	interpolateVariablesRecursive
};
