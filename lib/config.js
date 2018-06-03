/**
 * This module build the config from different sources
 */
const path = require('path');
const { mergeDeep } = require('./utils');
const { configDefault } = require('./defaults');
const { validateConfigFileField } = require('./validators');
const { getAbsoluteCWD, isTestRunning, getContentFileJson } = require('./utils');
const { messages } = require('./i18n');


/**
 * get configs from different sources
 * @returns {*}
 */
const getConfigFromSources = () => {
	let packageJson = getConfigFromPackageJson();
	let configFromPackageJsonConfigFile = getConfigFromPackageJsonConfigFile(packageJson);
	let appName = messages.app.name;
	let configFileName = null;

	if (configFromPackageJsonConfigFile) {
		configFileName = packageJson[appName].configFile;
	}

	return {
		packageFile: { fileName: 'package.json', content: packageJson },
		configFile: { fileName: configFileName, content: configFromPackageJsonConfigFile },
		executorFile: { fileName: `${appName}.json`, content: getConfigFromExecutorFile() }
	};
};


/**
 * merge config with default
 * @returns {any}
 */
const getConfigMergedWithDefault = (config) => {
	return mergeDeep(configDefault, config);
};


/**
 * get the current package from cwd
 * @returns {*}
 */
const getConfigFromPackageJson = () => {
	return _getConfigFromJsonFile('package');
};

/**
 * get the current config from cwd
 * @returns {*}
 */
const getConfigFromExecutorFile = () => {
	return _getConfigFromJsonFile(messages.app.name);
};


/**
 *
 * @param name
 * @returns {*}
 * @private
 */
const _getConfigFromJsonFile = (name) => {
	return getConfigFromJson(getAbsoluteCWD(), `${name}.json`);
};


/**
 * this looking the configuration file on package.json config
 *
 * @param packageJson
 * @returns {object}
 */
const getConfigFromPackageJsonConfigFile = (packageJson) => {
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
const getConfigFromJson = (filePath, fileName) => {
	let configJson = null;
	let configJsonPath = path.normalize(`${filePath}/${fileName}`);

	try {
		configJson = getContentFileJson(configJsonPath);
	} catch(e) {
		// *.json not found on filePath folder
		if (e.name === 'ExecutorError') {
			if (e.code !== messages.errors.config.internalNotFound.code) {
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
	getConfigFromJson,
	getConfigMergedWithDefault
};
