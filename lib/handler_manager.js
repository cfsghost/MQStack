"use strict";

var events = require('events');
var util = require('util');

var HandlerManager = module.exports = function(_parent) {
	var self = this;

	this.context = _parent;

	// Default handler 
	this.add('output', require('./handlers/output')(), function() {
		self.emit('ready');
	});
};

util.inherits(HandlerManager, events.EventEmitter);

HandlerManager.prototype.exists = function(handlerName) {
	var self = this;

	// No handler can deal with this message
	if (!self.listeners(handlerName).length) {
		return false;
	}

	return true;
};

HandlerManager.prototype.add = function(handlerName, handler, callback) {
	var self = this;

	handler.once('ready', function() {

		// When message need such handler
		self.on(handlerName, function(packet) {
			handler.emit('input', packet);
		});

		if (callback)
			callback();
	});

	// Initializing this handler
	handler.emit('initialize', self.context);
};
