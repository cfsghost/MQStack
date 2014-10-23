"use strict";

var events = require('events');
var util = require('util');

var HandlerManager = module.exports = function(_parent) {
	this.context = _parent;

	// Default handler 
	this.add('output', require('./handlers/output')());
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

HandlerManager.prototype.add = function(handlerName, handler) {
	var self = this;

	handler.once('ready', function() {
		self.on(handlerName, function(packet) {
			handler.emit('input', packet);
		});
	});

	// Initializing this handler
	handler.emit('initialize', self.context);
};
