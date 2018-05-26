// const { assert } = require('chai');
// const { messages } = require('./i18n');
// const { getPackageJson } = require('./package');
//
//
// describe('getContentFileJson()', function() {
//
// 	it('should read test 00 (sub-folder)', function() {
// 		let r = getPackageJson('test/fixture/00');
//
// 		assert.isObject(r);
// 		assert.isEmpty(r);
// 	});
//
// 	xit('should throw an error by invalid format on file', function() {
// 		let jsonFile = 'test/fixture/01s';
// 			getPackageJson(jsonFile);
// 		assert.throw(() => {
// 		}, messages.config.invalidJson.toTemplate({ jsonFile }));
// 	});
//
// });
