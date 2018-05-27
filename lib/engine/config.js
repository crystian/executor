/**
 * This module build the config from different sources
 */
const path = require('path');
const { mergeDeep } = require('./utils');
const { configDefault } = require('../defaults');
const { validateConfigFileField } = require('./validators');
const { getAbsoluteCWD, isTestRunning, getContentFileJson } = require('./utils');
const { messages } = require('./i18n');


/**
 * get the config from different sources
 * @returns {any}
 */
let getConfigFromSources = () => {
	// const defaultConf = configDefault;
	const packageJson = getConfigFromPackageJson();
	const configFile = getConfigFromPackageJsonConfigFile(packageJson);
	const executorFile = getConfigFromExecutorFile();

	console.log(configDefault);
	console.log(packageJson);
	console.log(configFile);
	console.log(executorFile);

	let r = {};

	if (packageJson && packageJson[messages.app.name]) {
		r = mergeDeep(r, packageJson[messages.app.name]);

		if (configFile) {
			delete r.configFile;
			r = mergeDeep(r, configFile);
		} else {
			if (executorFile) {
				delete r.configFile;
				r = mergeDeep(r, executorFile);
			}
		}
	} else if (executorFile) {
		r = mergeDeep(r, executorFile);
	}

	return r;

};


/**
 * get the current package from cwd
 * @returns {*}
 */
let getConfigFromPackageJson = () => {
	return getConfigFromJson(getAbsoluteCWD(), 'package.json');
};

/**
 * get the current config from cwd
 * @returns {*}
 */
let getConfigFromExecutorFile = () => {
	return getConfigFromJson(getAbsoluteCWD(), `${messages.app.name}.json`);
};


/**
 * this looking the configuration file on package.json config
 *
 * @param packageJson
 * @returns {object}
 */
let getConfigFromPackageJsonConfigFile = (packageJson) => {
	let configFile = null;

	if (validateConfigFileField(packageJson)) {
		const appName = messages.app.name;
		const configFileName = packageJson[appName].configFile;

		// I don't use getConfigFromJson because in this case I want to throw an error
		configFile = getContentFileJson(configFileName);

		// it is ok, I can use "console.primary" because I don't have the configuration to finish with this
		/* istanbul ignore if  */
		if (!isTestRunning()) {
			console.log('\x1b[37m%s\x1b[0m', `[${messages.app.name}]`, messages.config.used.toTemplate({ configFileName }));
		}
	}

	return configFile;
};


/**
 * parse json file with config
 *
 * @param filePath
 * @param fileName
 * @returns {*}
 */
let getConfigFromJson = (filePath, fileName) => {
	let configJson = null;
	let configJsonPath = path.normalize(`${filePath}/${fileName}`);

	try {
		configJson = getContentFileJson(configJsonPath);
	} catch(e) {
		// *.json not found on filePath folder
		if (e.name === 'ExecutorError') {
			if (e.code !== messages.errors.config.notFound.code) {
				throw e;
			}
			// intentionally, it does not throw an error
			// throw new ExecutorError(messages.errors.configJson.notFound, {folder: configJsonPath});
		} else {
			throw e;
		}
	}
	return configJson;
};

module.exports = {
	getConfigFromSources,
	getConfigFromPackageJson,
	getConfigFromPackageJsonConfigFile,
	getConfigFromExecutorFile,
	getConfigFromJson
};
