"use strict";

var MQStack = module.exports = require('./stack');

MQStack.createHandler = function(templateName) {
	if (templateName) {
		return require('./handlers/' + templateName)();
	}

	// Basic template
	return new require('./handler')();
};
