/**
 * This module build the config from different sources
 */

// const fs = require('fs');
// const { isString, isTestRunning, getAbsoluteCWD, mergeDeep } = require('./utils');
// const { messages } = require('./i18n');


/**
 * get the config from different sources
 * @returns {any}
 */
let getConfigFromSources = () => {
	// const packageJson = _getPackageJson(filePath);
	// const packageJsonConfig = packageJson && packageJson[messages.app.name];
	// const configFileName = getConfigFileName(packageJson);






	// return getConfig2(getAbsoluteCWD());
};



//
// /**
//  * get the config from a parameter sent
//  *
//  * @param filePath
//  * @returns {any}
//  */
// let getConfig = (filePath) => {
// 	const packageJson = _getPackageJson(filePath);
// 	const packageJsonConfig = packageJson && packageJson[messages.app.name];
// 	const configFileName = getConfigFileName(packageJson);
// 	let r = {};
//
// 	if (packageJson && packageJsonConfig) {
// 		r = packageJsonConfig;
// 		try {
// 			const contentJsonFile = getContentJsonFile(configFileName);
// 			r = mergeDeep(packageJsonConfig, contentJsonFile);
// 		} catch(e) {
// 			// if it is a configFile on package.json should throw an error
// 			if (packageJsonConfig.configFile) {
// 				throw e;
// 			}
//
// 		}
//
// 	} else {
// 		r = getContentJsonFile(configFileName);
// 	}
//
// 	return r;
// };
//
//
// /**
//  * this looking the configuration file on user folder, on package.json config and its file
//  *
//  * @param packageJson
//  * @returns {string}
//  */
// let getConfigFileName = (packageJson) => {
// 	const appName = messages.app.name;
// 	let configFileName = `${appName}.json`;
//
// 	if (packageJson && packageJson[appName]) {
// 		const configFile = packageJson[appName].configFile;
// 		if (configFile) {
// 			if (isString(configFile)) {
// 				configFileName = configFile;
// 			} else {
// 				throw new Error(messages.config.isNotAString);
// 			}
// 		}
//
//
// 		// it is ok, I can use "console.primary" because I don't have the configuration to finish with this
// 		/* istanbul ignore if  */
// 		if (!isTestRunning()) {
// 			console.log('\x1b[37m%s\x1b[0m', `[${messages.app.name}]`, messages.config.used.toTemplate({ configFileName }));
// 		}
//
// 	}
//
// 	return configFileName;
// };


module.exports = {
	getConfigFromSources
	// getConfigFromCWD,
	// getAbsoluteCWD,
	// getConfig,
	// getConfigFileName,
};