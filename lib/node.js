/**
 * this module is auxiliary to index, and I can use unit test easily :)
 */

const fs = require('fs');
const path = require('path');
const { isString, isTestRunning } = require('./utils');
const { messages } = require('./i18n');


/**
 * get the config from user folder
 * @returns {any}
 */
let getConfigFromCWD = () => {
	return getConfig(getAbsoluteCWD());
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


/**
 * get the config from a parameter sent
 *
 * @param filePath
 * @returns {any}
 */
let getConfig = (filePath) => {
	let configFileName = getConfigFileName(filePath);

	return getContentJsonFile(configFileName);
};


/**
 * this looking the configuration file on user folder, on package.json config and its file
 *
 * @param filePath
 * @returns {string}
 */
let getConfigFileName = (filePath) => {
	let packageJson = _getPackageJson(filePath),
		configFileName = 'executor.json';

	if (packageJson && packageJson.executor) {
		let configFile = packageJson.executor.configFile;
		if (configFile) {
			if (isString(configFile)) {
				configFileName = configFile;
			} else {
				throw new Error(messages.config.isNotAString);
			}
		}
		
		/* istanbul ignore if  */
		if (!isTestRunning()) {
			// it is ok, I can use "console.primary" because I don't have the configuration to finish with this
			console.log('\x1b[37m%s\x1b[0m', `\n[${messages.app.name}]`, messages.config.used.toTemplate({configFileName}));
		}
	}

	return configFileName;
};


/**
 * intent to get the package json to use it for configure it
 *
 * @param filePath
 * @returns {*}
 * @private
 */
let _getPackageJson = (filePath) => {
	let packageJson = null;
	filePath = filePath ? filePath + '/' : '';
	try {
		packageJson = getContentJsonFile(`${filePath}package.json`);
	} catch(e) {
		// package.json not found on current folder
	}
	return packageJson;
};


/**
 * parse the content of file sent
 *
 * @param jsonFile
 * @returns {any}
 */
let getContentJsonFile = (jsonFile) => {
	let contentFile = getContentFile(jsonFile);

	try {
		return JSON.parse(contentFile);
	} catch(e) {
		throw new Error(messages.config.invalidJson.toTemplate({jsonFile}));
	}
};


/**
 * should send the absolute path
 *
 * @param fileName
 */
let getContentFile = (fileName) => {
	if (fs.existsSync(fileName)) {
		return fs.readFileSync(fileName, 'utf8');
	} else {
		throw new Error(messages.config.notFound.toTemplate({fileName}));
	}
};


module.exports = {
	getConfigFromCWD,
	getAbsoluteCWD,
	getConfig,
	getConfigFileName,
	getContentJsonFile,
	getContentFile
};
