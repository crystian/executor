/**
 * Resources various from me and others to keep calm and code easy
 */

// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
// https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string?noredirect=1&lq=1

const path = require('path');

const isString = (value) => {
	return (typeof value === 'string');
};


const isObject = (item) => {
	return !!(item && typeof item === 'object' && !Array.isArray(item));
};

const isObjectEmpty = (item) => {
	return (Object.keys(item).length === 0 && item.constructor === Object);
};

const isTestRunning = () => {
	return (process.argv.find(element => element.indexOf('mocha') !== -1));
};


const setColors = (config) => {
	let primary = console.log,
		secondary = console.log,
		alert = console.log;

	/* istanbul ignore next */
	console.primary = function() {
		primary.apply(console, setColor(config.useColors, config.colors.primary, arguments));
	};

	/* istanbul ignore next */
	console.secondary = function() {
		secondary.apply(console, setColor(config.useColors, config.colors.secondary, arguments));
	};

	/* istanbul ignore next */
	console.alert = function() {
		alert.apply(console, setColor(config.useColors, config.colors.alert, arguments));
	};
};

const setColor = (useColors, color, _arguments) => {
	let args = _arguments;

	if (useColors) {
		args = [color, ...args];
	}

	return args;
};

/**
 * resolve the folder where the user is
 *
 * @returns {*}
 */
let getAbsoluteCWD = () => {
	return _getAbsolute(process.cwd());
};
let _getAbsolute = (_path) => {
	return path.normalize(path.resolve(_path));
};

// does not need it apparently
// let getRelativeCWD = () => {
// 	return path.normalize(path.basename(path.dirname(fs.realpathSync(__filename))));
// };

String.prototype.toTemplate = function(map, fallback) {
	return this.replace(/\${.+?}/g, (match) => {
		const path = match.substr(2, match.length - 3).trim();
		return getAttribute(path, map, fallback);
	});
};

const getAttribute = (path, obj, fb = `$\{${path}}`) => {
	return path.split('.').reduce((res, key) => res[key] || fb, obj);
};

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
	}

	return output;
};


module.exports = {
	isString,
	isObject,
	isObjectEmpty,
	isTestRunning,
	setColors,
	setColor,
	getAbsoluteCWD,
	mergeDeep
};

