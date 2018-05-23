/**
 * Resources various from me and others to keep calm and code easy
 */

const fs = require('fs');
const path = require('path');
const { messages } = require('./i18n');


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
 * should return the absolute path of execution
 *
 * @param fileName
 */
let getContentFile = (fileName) => {
	if (fs.existsSync(fileName)) {
		return fs.readFileSync(fileName, 'utf8');
	}
	throw new Error(messages.config.notFound.toTemplate({ fileName }));
};


/**
 * @param value
 * @returns {boolean}
 */
const isString = (value) => {
	return (typeof value === 'string');
};


/**
 * @param item
 * @returns {boolean}
 */
const isObject = (item) => {
	return !!(item && typeof item === 'object' && !Array.isArray(item));
};


/**
 * @param item
 * @returns {boolean}
 */
const isObjectEmpty = (item) => {
	return (isObject(item) && Object.keys(item).length === 0 && item.constructor === Object);
};


/**
 * just for mocha and do not dirty the console and others features
 *
 * @returns {boolean}
 */
const isTestRunning = () => {
	return !!(process.argv.find(element => element.indexOf('mocha') !== -1));
};


/**
 * return the folder where the user is, skipped for coverage
 *
 * @returns {*}
 */
/* istanbul ignore next */
let getAbsoluteCWD = () => {
	return path.normalize(path.resolve(process.cwd()));
};

// does not need it apparently
// let getRelativeCWD = () => {
// 	return path.normalize(path.basename(path.dirname(fs.realpathSync(__filename))));
// };


/**
 * merge two object on deeper way
 *
 * From: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 * @param target
 * @param source
 * @returns {*}
 */
const mergeDeep = (target, source) => {
	let output = Object.assign({}, target);

	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach(key => {
			if (isObject(source[key])) {
				if (!(key in target)) {
					Object.assign(output, { [key]: source[key] });
				} else {
					output[key] = mergeDeep(target[key], source[key]);
				}
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		});
	} else {
		throw new Error(messages.global.mergeDeepInvalidObjects);
	}
	return output;
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
	getContentFile,
	isString,
	isObject,
	isObjectEmpty,
	isTestRunning,
	setColor,
	setColors,
	getAbsoluteCWD,
	mergeDeep
};


