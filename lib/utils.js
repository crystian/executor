/**
 * Resources various from me and others to keep calm and code easy
 */
const fs = require('fs');
const path = require('path');
const { messages } = require('./i18n');


/**
 * get the content from any file
 *
 * @param fileName
 */
let getContentFile = (fileName) => {
	if (fs.existsSync(fileName)) {
		return fs.readFileSync(fileName, 'utf8');
	}

	throw new ExecutorError(messages.errors.config.notFound, { fileName, cwd: getAbsoluteCWD() });
};


/**
 * get the content and parse to json format
 *
 * @param jsonFile
 * @returns {any}
 */
let getContentFileJson = (jsonFile) => {
	const contentFile = getContentFile(jsonFile);

	try {
		return JSON.parse(contentFile);
	} catch(e) {
		throw new ExecutorError(messages.errors.config.invalidJson, { jsonFile });
	}
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
		throw new ExecutorError(messages.errors.global.mergeDeepInvalidObjects);
	}
	return output;
};


module.exports = {
	getContentFile,
	getContentFileJson,
	isString,
	isObject,
	isObjectEmpty,
	isTestRunning,
	getAbsoluteCWD,
	mergeDeep
};


