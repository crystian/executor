/**
 * Extends the language with polyfills and others
 */
const { messages } = require('./i18n');
const { isObject } = require('./utils');


/**
 * Error with custom structure to user and unit test
 */
class ExecutorError extends Error {
	constructor(data, templates) {
		super();
		this.name = this.constructor.name;

		/* istanbul ignore next */
		this.code = data.code || '1';

		templates = isObject(templates) ? templates : {};

		this.message = `[${messages.app.name}] ${data.msg.toTemplate(templates)}`;
		/* istanbul ignore next */
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ExecutorError);
		}
	}
}
global.ExecutorError = ExecutorError;


/**
 * add toTemplate function to string object
 *
 * From: https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string?noredirect=1&lq=1
 * @param map
 * @param fallback
 * @returns {string}
 */
String.prototype.toTemplate = function(map, fallback) {
	const getAttribute = (path, obj, fb = `$\{${path}}`) => {
		return path.split('.').reduce((res, key) => res[key] || fb, obj);
	};

	return this.replace(/\${.+?}/g, (match) => {
		const path = match.substr(2, match.length - 3).trim();
		return getAttribute(path, map, fallback);
	});
};


/**
 * just for user, skipped for coverage
 *
 * @param config
 */
/* istanbul ignore next */
const setColors = (config) => {
	let primary = console.log,
		secondary = console.log,
		alert = console.log;

	console.primary = function() {
		primary.apply(console, setColor(config.useColors, config.colors.primary, arguments));
	};

	console.secondary = function() {
		secondary.apply(console, setColor(config.useColors, config.colors.secondary, arguments));
	};

	console.alert = function() {
		alert.apply(console, setColor(config.useColors, config.colors.alert, arguments));
	};
};


/**
 * set the color for console, for first argument only
 *
 * @param useColors
 * @param color
 * @param _arguments
 * @returns {*}
 */
const setColor = (useColors, color, _arguments) => {
	let args = _arguments;

	if (useColors) {
		args = [color, ...args];
	}

	return args;
};


module.exports = {
	setColor,
	setColors,
	ExecutorError
};
