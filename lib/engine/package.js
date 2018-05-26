/**
 * this module handle the package.json
 */

const { ExecutorError } = require('./utils');

// const fs = require('fs');
const { getContentFileJson } = require('./utils');
const { messages } = require('./i18n');


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


/**
 * intent to get the package json to use it for configure it
 *
 * @param filePath
 * @returns {*}
 * @private
 */
let getPackageJson = (filePath) => {
	let packageJson = null;
	filePath = filePath ? filePath + '/' : '';
	let packageJsonPath = `${filePath}package.json`;

	try {
		packageJson = getContentFileJson(packageJsonPath);
	} catch(e) {
		// package.json not found on filePath folder
		console.log(e.name);
		console.log(e instanceof ExecutorError);
		if (e.name === 'ExecutorError') {
			throw new Error(messages.packageJson.notFound.toTemplate({folder: packageJsonPath}));
		} else {
			throw e;
		}
	}
	return packageJson;
};


module.exports = {
	getPackageJson
	// getConfigFromCWD,
	// getAbsoluteCWD,
	// getConfig,
	// getConfigFileName,
	// getContentJsonFile
};
