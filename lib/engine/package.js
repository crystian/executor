/**
 * this module handle the package.json
 */

// const fs = require('fs');
// // const { isString, isTestRunning, getAbsoluteCWD, mergeDeep } = require('./utils');
// const { messages } = require('../i18n');


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
//
//
// /**
//  * parse the content of file sent
//  *
//  * @param jsonFile
//  * @returns {any}
//  */
// let getContentJsonFile = (jsonFile) => {
// 	const contentFile = getContentFile(jsonFile);
//
// 	try {
// 		return JSON.parse(contentFile);
// 	} catch(e) {
// 		// throw new Error(messages.config.invalidJson.toTemplate({ jsonFile }));
// 	}
// };
//
//
// /**
//  * intent to get the package json to use it for configure it
//  *
//  * @param filePath
//  * @returns {*}
//  * @private
//  */
// let _getPackageJson = (filePath) => {
// 	let packageJson = null;
// 	filePath = filePath ? filePath + '/' : '';
// 	try {
// 		packageJson = getContentJsonFile(`${filePath}package.json`);
// 	} catch(e) {
// 		// package.json not found on current folder
// 	}
// 	return packageJson;
// };





module.exports = {
	// getConfigFromCWD,
	// getAbsoluteCWD,
	// getConfig,
	// getConfigFileName,
	// getContentJsonFile
};
